import { BigNumber } from '@ethersproject/bignumber'
import BigNumberJs from 'bignumber.js'
import { TransactionResponse } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { JSBI, Percent, Router, SwapParameters, Trade, TradeType } from 'sdk'
import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useGasPrice } from 'state/user/hooks'
import truncateHash from 'utils/truncateHash'
import errorMap, { ErrorFrom } from 'config/constants/errorMap'
import { getBalanceAmount } from 'utils/formatBalance'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { log } from 'next-axiom'
import { BIPS_BASE, INITIAL_ALLOWED_SLIPPAGE } from '../config/constants'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, isAddress } from '../utils'
import isZero from '../utils/isZero'
import useTransactionDeadline from './useTransactionDeadline'
import useENS from './ENS/useENS'
import { AggregatorDerivedQuote } from '../aggregator/types'
import { EMPTY_ARRAY } from '../utils/constantObjects'
import { useRouterContract } from './useContract'
import { useWeb3LibraryContext } from '../wagmiUtil/provider'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface SwapCall {
  contract: Contract
  parameters: SwapParameters
}

interface SuccessfulCall {
  call: SwapCall
  gasEstimate: BigNumber
}

interface FailedCall {
  call: SwapCall
  error: Error
}

type EstimatedSwapCall = SuccessfulCall | FailedCall

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 */
function useSwapCallArguments(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): SwapCall[] {
  const { account, chainId } = useActiveWeb3React()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress
  const deadline = useTransactionDeadline()

  const contract = useRouterContract()
  return useMemo(() => {
    if (!trade || !recipient || !account || !chainId || !deadline) return EMPTY_ARRAY

    if (!contract) {
      return EMPTY_ARRAY
    }

    const swapMethods = []

    swapMethods.push(
      Router.swapCallParameters(trade, {
        feeOnTransfer: false,
        allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
        recipient,
        deadline: deadline.toNumber(),
      }),
    )

    if (trade.tradeType === TradeType.EXACT_INPUT) {
      swapMethods.push(
        Router.swapCallParameters(trade, {
          feeOnTransfer: true,
          allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
          recipient,
          deadline: deadline.toNumber(),
        }),
      )
    }

    return swapMethods.map((parameters) => ({ parameters, contract }))
  }, [account, allowedSlippage, chainId, contract, deadline, recipient, trade])
}

const createTradeSwapCall = ({
  swapCalls,
  gasPrice,
  account,
  trade,
  recipient,
  recipientAddressOrName,
  addTransaction,
}) => {
  return async function onSwap(): Promise<string> {
    const estimatedCalls: EstimatedSwapCall[] = await Promise.all(
      swapCalls.map((call) => {
        const {
          parameters: { methodName, args, value },
          contract,
        } = call
        const options = !value || isZero(value) ? {} : { value }

        return contract.estimateGas[methodName](...args, options)
          .then((gasEstimate) => {
            return {
              call,
              gasEstimate,
            }
          })
          .catch((gasError) => {
            console.error('Gas estimate failed, trying eth_call to extract error', call)

            return contract.callStatic[methodName](...args, options)
              .then((result) => {
                console.error('Unexpected successful call after failed estimate gas', call, gasError, result)
                return { call, error: new Error('Unexpected issue with estimating the gas. Please try again.') }
              })
              .catch((callError) => {
                console.error('Call threw error', call, callError)
                const reason: string = callError.reason || callError.data?.message || callError.message
                const errorMessage = errorMap(reason, ErrorFrom.SWAP)

                return { call, error: new Error(errorMessage) }
              })
          })
      }),
    )
    // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
    const successfulEstimation = estimatedCalls.find(
      (el, ix, list): el is SuccessfulCall =>
        'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1]),
    )

    if (!successfulEstimation) {
      const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
      if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
      throw new Error('Unexpected error. Please contact support: none of the calls threw an error')
    }

    const {
      call: {
        contract,
        parameters: { methodName, args, value },
      },
      gasEstimate,
    } = successfulEstimation

    return contract[methodName](...args, {
      gasLimit: calculateGasMargin(gasEstimate),
      gasPrice,
      ...(value && !isZero(value) ? { value, from: account } : { from: account }),
    })
      .then((response: any) => {
        const inputSymbol = trade.inputAmount.currency.symbol
        const outputSymbol = trade.outputAmount.currency.symbol
        const inputAmount = trade.inputAmount.toSignificant(3)
        const outputAmount = trade.outputAmount.toSignificant(3)

        const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`
        const withRecipient =
          recipient === account
            ? base
            : `${base} to ${
                recipientAddressOrName && isAddress(recipientAddressOrName)
                  ? truncateHash(recipientAddressOrName)
                  : recipientAddressOrName
              }`

        addTransaction(response, {
          summary: withRecipient,
        })

        return response.hash
      })
      .catch((error: any) => {
        // if the user rejected the tx, pass this along
        if (error?.code === 4001) {
          throw new Error('Transaction rejected.')
        } else {
          // otherwise, the error was unexpected and we need to convey that
          console.error(`Swap failed`, error, methodName, args, value)
          throw new Error(`Swap failed: ${errorMap(error.message, ErrorFrom.SWAP)}`)
        }
      })
  }
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId, library } = useActiveWeb3React()
  const gasPrice = useGasPrice()
  const swapCalls = useSwapCallArguments(trade, allowedSlippage, recipientAddressOrName)

  const addTransaction = useTransactionAdder()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  return useMemo(() => {
    if (!trade || !library || !account || !chainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return { state: SwapCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
      }
      return { state: SwapCallbackState.LOADING, callback: null, error: null }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: createTradeSwapCall({
        swapCalls,
        gasPrice,
        account,
        trade,
        recipient,
        recipientAddressOrName,
        addTransaction,
      }),
      error: null,
    }
  }, [trade, library, account, chainId, recipient, recipientAddressOrName, swapCalls, addTransaction, gasPrice])
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useAggregatorSwapCallback(
  wrappedQuote: AggregatorDerivedQuote | undefined, // quote to execute, required
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): {
  state: SwapCallbackState
  callback: null | ((confirmDerivedQuote: AggregatorDerivedQuote) => Promise<string>)
  error: string | null
} {
  const quote = wrappedQuote?.quote
  const { account, chainId } = useActiveWeb3React()
  const library = useWeb3LibraryContext()

  // const swapCalls = useSwapCallArguments(trade, allowedSlippage, recipientAddressOrName)

  const addTransaction = useTransactionAdder()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  return useMemo(() => {
    if (!quote || !library || !account || !chainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return { state: SwapCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
      }
      return { state: SwapCallbackState.LOADING, callback: null, error: null }
    }
    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(confirmDerivedQuote: AggregatorDerivedQuote): Promise<string> {
        // let gas: BigNumber = BigNumber.from(confirmDerivedQuote.quote.gas).mul(12).div(10)
        // if (confirmDerivedQuote.currencies.INPUT.symbol === ETHER[chainId].symbol) {
        //   gas = BigNumber.from(confirmDerivedQuote.quote.gas).mul(12).div(10)
        // } else {
        //   // X5 for non native token
        //   gas = BigNumber.from(confirmDerivedQuote.quote.gas).mul(20)
        // }

        const transaction = {
          from: account,
          to: confirmDerivedQuote.quote.to,
          // add ~20% gas just to be save
          gas: BigNumber.from(confirmDerivedQuote.quote.gas).mul(12).div(10).toHexString(),
          gasPrice: BigNumber.from(confirmDerivedQuote.quote.gasPrice).toHexString(),
          value: BigNumber.from(confirmDerivedQuote.quote.value).toHexString(),
          data: confirmDerivedQuote.quote.data,
        }

        // const estimatedGas = await library
        //   .estimateGas(transaction)
        //   .then((gas) => gas._hex)
        //   .catch((e) => {
        //     return BigNumber.from(confirmDerivedQuote.quote.gas).toHexString()
        //   })
        // console.log(estimatedGas)

        return library
          .send('eth_sendTransaction', [transaction])
          .then(async (transactionHash: string) => {
            const inputSymbol = confirmDerivedQuote.currencies.INPUT.symbol
            const outputSymbol = confirmDerivedQuote.currencies.OUTPUT.symbol
            const inputAmount = confirmDerivedQuote.currencyBalances.INPUT.toSignificant(3)
            const outputAmount = confirmDerivedQuote.currencyBalances.OUTPUT.toSignificant(3)
            const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`
            const withRecipient =
              recipient === account
                ? base
                : `${base} to ${
                    recipientAddressOrName && isAddress(recipientAddressOrName)
                      ? truncateHash(recipientAddressOrName)
                      : recipientAddressOrName
                  }`
            const sellTokenToEthRate = new BigNumberJs(quote.sellTokenToEthRate)

            const transactionData = {
              txn: transactionHash,
              maker: account,
              sellToken: wrappedCurrency(confirmDerivedQuote.currencies.INPUT, chainId)?.address,
              buyToken: wrappedCurrency(confirmDerivedQuote.currencies.OUTPUT, chainId)?.address,
              ethValue: sellTokenToEthRate.gt(0)
                ? getBalanceAmount(
                    new BigNumberJs(quote.sellAmount).div(sellTokenToEthRate),
                    confirmDerivedQuote.currencies.INPUT.decimals,
                  )
                : new BigNumberJs(0),
              chainId: quote.chainId,
              createdAt: new Date(),
              sellTokenValue: confirmDerivedQuote.currencyBalances.INPUT.toSignificant(6),
              buyTokenValue: confirmDerivedQuote.currencyBalances.OUTPUT.toSignificant(6),
            }
            log.info(`Try process transaction: ${transactionHash}`)

            addTransaction(
              {
                hash: transactionHash,
              } as TransactionResponse,
              {
                summary: withRecipient,
                data: transactionData.sellToken !== transactionData.buyToken ? transactionData : undefined,
              },
            )

            return transactionHash
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, confirmDerivedQuote.quote)
              throw new Error(`Swap failed: ${errorMap(error.message, ErrorFrom.SWAP)}`)
            }
          })
      },
      error: null,
    }
  }, [quote, library, account, chainId, recipient, recipientAddressOrName, addTransaction])
}
