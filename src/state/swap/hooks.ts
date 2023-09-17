import { parseUnits } from '@ethersproject/units'
import { ChainId, Currency, CurrencyAmount, JSBI, Token, TokenAmount, Trade, ETHER } from 'sdk'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useAllTokens } from 'hooks/Tokens'
import { useTradeExactIn } from 'hooks/Trades'
import { useTranslation } from 'contexts/Localization'
import { isAddress } from 'utils'
import { AggregatorDerivedQuote, AggregatorQuote } from 'aggregator/types'
import { replaceQueryParam } from 'utils/limitlessUtils'
import isEmpty from 'lodash/isEmpty'
import { AppDispatch, AppState } from '../index'
import { useCurrencyBalance } from '../wallet/hooks'
import {
  Field,
  replaceSwapState,
  selectCurrency,
  setRecipient,
  switchCurrencies,
  typeInput,
  updateDerivedPairData,
  updatePairData,
} from './actions'
import { SwapState } from './reducer'
import fetchPairPriceData from './fetch/fetchPairPriceData'
import {
  normalizeChartData,
  normalizeDerivedChartData,
  normalizeDerivedPairDataByActiveToken,
  normalizePairDataByActiveToken,
} from './normalizers'
import { PairDataTimeWindowEnum } from './types'
import { derivedPairByDataIdSelector, pairByDataIdSelector } from './selectors'
import { DEFAULT_OUTPUT_CURRENCY } from './constants'
import fetchDerivedPriceData from './fetch/fetchDerivedPriceData'
import { pairHasEnoughLiquidity } from './fetch/utils'
import useLpAddress from '../../hooks/useLpAddress'
import { addCacheToken, customTokenStorageKey, WrappedTokenInfo } from '../lists/actions'
import { CHAIN_ID } from 'utils/getRpcUrl'

export function useSwapState(): AppState['swap'] {
  return useSelector<AppState, AppState['swap']>((state) => state.swap)
}

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string) => void
  onChangeRecipient: (recipient: string | null) => void
} {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      const isCertifiedToken = currency instanceof WrappedTokenInfo
      const currencyId =
        currency instanceof Token ? currency.address : currency === ETHER[chainId] ? ETHER[chainId]?.symbol : ''
      dispatch(
        selectCurrency({
          field,
          currencyId,
        }),
      )
      if (currencyId) {
        const tokenId = isCertifiedToken ? currency.symbol : currencyId
        if (field === Field.INPUT) {
          replaceQueryParam({ sellToken: tokenId })
        } else {
          replaceQueryParam({ token: tokenId })
        }
      }

      if (currency !== ETHER[chainId]) {
        const token = currency as any
        if (!token?.tokenInfo?.vetted) {
          try {
            let localCustomTokens = null
            const localCustomTokensStr = localStorage.getItem(customTokenStorageKey)
            if (localCustomTokensStr) {
              localCustomTokens = JSON.parse(localCustomTokensStr)
            }

            if (!localCustomTokens) {
              localCustomTokens = {}
            }

            if (!localCustomTokens[chainId]) {
              localCustomTokens[chainId] = {}
            }
            const loweredAddr = token.address.toLowerCase()

            if (!localCustomTokens[chainId][loweredAddr]) {
              const cacheToken = new WrappedTokenInfo(
                {
                  ...token.tokenInfo,
                  render: 'swap',
                },
                [],
              )
              localCustomTokens[chainId][loweredAddr] = cacheToken
              setTimeout(() => {
                dispatch(
                  addCacheToken({
                    cacheToken,
                    chainId,
                  }),
                )
              }, 1000)
            }

            localStorage.setItem(customTokenStorageKey, JSON.stringify(localCustomTokens))
          } catch (ex) {
            console.error(ex)
          }
        }
      }
    },
    [chainId, dispatch],
  )

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies())
  }, [dispatch])

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch],
  )

  const onChangeRecipient = useCallback(
    (recipient: string | null) => {
      dispatch(setRecipient({ recipient }))
    },
    [dispatch],
  )

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
  }
}

// try to parse a user entered amount for a given token
export function tryParseAmount(
  value?: string,
  currency?: Currency,
  alreadyParsed?: boolean,
): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined
  }
  try {
    const typedValueParsed = alreadyParsed ? value : parseUnits(value, currency.decimals).toString()
    if (typedValueParsed !== '0') {
      return currency instanceof Token
        ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
        : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed), currency.chainId)
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return undefined
}

// Get swap price for single token disregarding slippage and price impact
export function useSingleTokenSwapInfo(
  token0Address: string,
  token1Address: string,
  inputCurrency: Currency,
  outputCurrency: Currency,
): { [key: string]: number } {
  const parsedAmount = tryParseAmount('1', inputCurrency ?? undefined)

  const bestTradeExactIn = useTradeExactIn(parsedAmount, outputCurrency ?? undefined)
  if (!inputCurrency || !outputCurrency || !bestTradeExactIn) {
    return null
  }

  const inputTokenPrice = parseFloat(bestTradeExactIn?.executionPrice?.toSignificant(6))
  const outputTokenPrice = 1 / inputTokenPrice

  return {
    [token0Address]: inputTokenPrice,
    [token1Address]: outputTokenPrice,
  }
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(
  allowedSlippage: number,
  account: string,
  inputCurrency: Currency,
  outputCurrency: Currency,
  priceData: AggregatorQuote,
): {
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount }
  availableBalance: CurrencyAmount
  parsedAmount: CurrencyAmount | undefined
  v2Trade: Trade | undefined
  inputError?: string
  wrappedSwapQuote: AggregatorDerivedQuote
} {
  const { t } = useTranslation()

  const { independentField, typedValue } = useSwapState()

  // const recipientLookup = useENS(recipient ?? undefined)
  // const to: string | null = (recipient === null ? account : recipientLookup.address) ?? null

  // const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
  //   inputCurrency ?? undefined,
  //   outputCurrency ?? undefined,
  // ])

  const isExactIn: boolean = independentField === Field.INPUT

  const [parsedAmount, parsedAmountOut] = isExactIn
    ? [
        tryParseAmount(typedValue, inputCurrency ?? undefined),
        tryParseAmount(priceData?.buyAmount, outputCurrency ?? undefined, true),
      ]
    : [
        tryParseAmount(priceData?.sellAmount, inputCurrency ?? undefined, true),
        tryParseAmount(typedValue, outputCurrency ?? undefined),
      ]

  // const hasLNT = false // inputCurrency?.address === tokens.lnt.address || outputCurrency?.address === tokens.lnt.address
  // const bestTradeExactIn = useTradeExactIn(
  //   hasLNT && isExactIn ? parsedAmount : undefined,
  //   hasLNT && outputCurrency ? outputCurrency : undefined,
  // )
  // const bestTradeExactOut = useTradeExactOut(
  //   hasLNT && inputCurrency ? inputCurrency : undefined,
  //   hasLNT && !isExactIn ? parsedAmountOut : undefined,
  // )

  // const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut

  // calculate whether to use trade or api based on best price
  // const shouldUseTrade = Boolean(
  //   hasLNT &&
  //     v2Trade &&
  //     parsedAmountOut &&
  //     parsedAmount &&
  //     v2Trade.outputAmount &&
  //     v2Trade.inputAmount &&
  //     (isExactIn ? v2Trade.outputAmount.greaterThan(parsedAmountOut) : v2Trade.inputAmount.lessThan(parsedAmount)),
  // )
  // console.log(
  //   'input',
  //   v2Trade?.inputAmount?.toSignificant(),
  //   parsedAmount?.toSignificant(),
  //   parsedAmount && v2Trade?.inputAmount?.lessThan(parsedAmount),
  // )
  // console.log(
  //   'output',
  //   v2Trade?.outputAmount?.toSignificant(),
  //   parsedAmountOut?.toSignificant(),
  //   parsedAmountOut && v2Trade?.outputAmount?.greaterThan(parsedAmountOut),
  // )
  // console.log('should use lnt trade:', shouldUseLNTTrade)
  // const currencyBalances = shouldUseTrade
  //   ? {
  //       [Field.INPUT]: v2Trade.inputAmount,
  //       [Field.OUTPUT]: v2Trade.outputAmount,
  //     }
  //   : {
  //       [Field.INPUT]: parsedAmount,
  //       [Field.OUTPUT]: parsedAmountOut,
  //     }
  const currencyBalances = {
    [Field.INPUT]: parsedAmount,
    [Field.OUTPUT]: parsedAmountOut,
  }
  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  }

  let inputError: string | undefined
  if (!account) {
    inputError = t('Connect Wallet')
  }

  if (!parsedAmount) {
    inputError = inputError ?? t('Enter an amount')
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? t('Select a token')
  }

  // const formattedTo = isAddress(to)
  // if (!to || !formattedTo) {
  //   inputError = inputError ?? t('Enter a recipient')
  // } else if (
  //   BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1 ||
  //   (bestTradeExactIn && involvesAddress(bestTradeExactIn, formattedTo)) ||
  //   (bestTradeExactOut && involvesAddress(bestTradeExactOut, formattedTo))
  // ) {
  //   inputError = inputError ?? t('Invalid recipient')
  // }

  // const slippageAdjustedAmounts = v2Trade && allowedSlippage && computeSlippageAdjustedAmounts(v2Trade, allowedSlippage)
  // // compare input balance to max input based on version
  // const [balanceIn, amountIn] = [
  //   currencyBalances[Field.INPUT],
  //   slippageAdjustedAmounts ? slippageAdjustedAmounts[Field.INPUT] : null,
  // ]

  const inputAmount = currencyBalances[Field.INPUT]
  const availableBalance = useCurrencyBalance(account ?? undefined, inputCurrency ?? undefined)
  if (availableBalance && inputAmount && availableBalance.lessThan(inputAmount)) {
    inputError = t('Insufficient %symbol% balance', { symbol: inputAmount.currency.symbol })
  }
  return {
    currencies,
    currencyBalances,
    parsedAmount,
    v2Trade: undefined,
    inputError,
    availableBalance,
    wrappedSwapQuote: priceData
      ? {
          currencyBalances,
          currencies,
          isExactIn,
          quote: priceData,
          account,
          trade: null,
          shouldUseTrade: false,
        }
      : null,
  }
}

function parseTokenAmountURLParameter(urlParam: any): string {
  // eslint-disable-next-line no-restricted-globals
  return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam)) ? urlParam : ''
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT
}

let previousChainId: ChainId = null
export function queryParametersToSwapState(
  defaultChainId: ChainId,
  allTokens: { [address: string]: Token },
): SwapState {
  const parsedQs = new URLSearchParams(window.location.search)

  const chainId = defaultChainId || Number(parsedQs.get('chainId')) || CHAIN_ID

  const isChainChange = previousChainId && previousChainId !== chainId

  const token = isChainChange ? '' : parsedQs.get('token')
  const sellToken = isChainChange ? '' : parsedQs.get('sellToken')
  const exactAmount = isChainChange ? '' : parsedQs.get('exactAmount')
  const exactField = isChainChange ? '' : parsedQs.get('exactField')

  const native = ETHER[chainId]
  let inputCurrency = native.symbol
  let outputCurrency

  switch (chainId) {
    case CHAIN_ID:
      outputCurrency = DEFAULT_OUTPUT_CURRENCY
      break
    case ChainId.BSC:
      outputCurrency = '0x4a68C250486a116DC8D6A0C5B0677dE07cc09C5D' // poodl
      break
    default:
      outputCurrency = null
  }

  const address = isAddress(token)
  const sellAddress = isAddress(sellToken)
  if (token) {
    const upperCase = String(token).toUpperCase()
    const sellUpperCase = String(sellToken).toUpperCase()
    const allTokenInfos = Object.values(allTokens)
    if (upperCase === native.symbol) {
      outputCurrency = native.symbol
      if (!sellUpperCase) {
        inputCurrency = allTokenInfos.find((t) => t.symbol === 'BUSD')?.address
      }
    } else if (upperCase) {
      // For the swap page only, use token as the way to configure buying that token, and set BNB as the token to be sold
      outputCurrency = address || allTokenInfos.find((t) => t.symbol === upperCase)?.address
    }

    if (sellUpperCase === native.symbol) {
      inputCurrency = native.symbol
    } else if (sellUpperCase) {
      // For the swap page only, use token as the way to configure buying that token, and set BNB as the token to be sold
      inputCurrency = sellAddress || allTokenInfos.find((t) => t.symbol === sellUpperCase)?.address || native.symbol
    }

    if (inputCurrency === outputCurrency) {
      if (inputCurrency !== native.symbol) {
        inputCurrency = native.symbol
      } else {
        inputCurrency = allTokenInfos.find((t) => t.symbol === 'BUSD')?.address
      }
    }
  }
  previousChainId = chainId
  return {
    [Field.INPUT]: {
      currencyId: inputCurrency,
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency,
    },
    typedValue: parseTokenAmountURLParameter(exactAmount),
    independentField: parseIndependentFieldURLParameter(exactField),
    recipient: '',
    pairDataById: {},
    derivedPairDataById: {},
  }
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch() {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const allTokens = useAllTokens()
  useEffect(() => {
    if (!chainId || isEmpty(allTokens)) return
    const parsed = queryParametersToSwapState(chainId, allTokens)
    dispatch(
      replaceSwapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId,
        recipient: null,
      }),
    )
  }, [dispatch, chainId, allTokens])
}
type useFetchPairPricesParams = {
  token0Address: string
  token1Address: string
  timeWindow: PairDataTimeWindowEnum
  currentSwapPrice: {
    [key: string]: number
  }
}

export const useFetchPairPrices = ({
  token0Address,
  token1Address,
  timeWindow,
  currentSwapPrice,
}: useFetchPairPricesParams) => {
  const [pairId, setPairId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const pairData = useSelector(pairByDataIdSelector({ pairId, timeWindow }))
  const derivedPairData = useSelector(derivedPairByDataIdSelector({ pairId, timeWindow }))
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchDerivedData = async () => {
      console.info(
        '[Price Chart]: Not possible to retrieve price data from single pool, trying to fetch derived prices',
      )
      try {
        // Try to get at least derived data for chart
        // This is used when there is no direct data for pool
        // i.e. when multihops are necessary
        const derivedData = await fetchDerivedPriceData(token0Address, token1Address, timeWindow)
        if (derivedData) {
          const normalizedDerivedData = normalizeDerivedChartData(derivedData)
          dispatch(updateDerivedPairData({ pairData: normalizedDerivedData, pairId, timeWindow }))
        } else {
          dispatch(updateDerivedPairData({ pairData: [], pairId, timeWindow }))
        }
      } catch (error) {
        console.error('Failed to fetch derived prices for chart', error)
        dispatch(updateDerivedPairData({ pairData: [], pairId, timeWindow }))
      } finally {
        setIsLoading(false)
      }
    }

    const fetchAndUpdatePairPrice = async () => {
      setIsLoading(true)
      const { data } = await fetchPairPriceData({ pairId, timeWindow })
      if (data) {
        // Find out if Liquidity Pool has enough liquidity
        // low liquidity pool might mean that the price is incorrect
        // in that case try to get derived price
        const hasEnoughLiquidity = pairHasEnoughLiquidity(data, timeWindow)
        const newPairData = normalizeChartData(data, timeWindow) || []
        if (newPairData.length > 0 && hasEnoughLiquidity) {
          dispatch(updatePairData({ pairData: newPairData, pairId, timeWindow }))
          setIsLoading(false)
        } else {
          console.info(`[Price Chart]: Liquidity too low for ${pairId}`)
          dispatch(updatePairData({ pairData: [], pairId, timeWindow }))
          fetchDerivedData()
        }
      } else {
        dispatch(updatePairData({ pairData: [], pairId, timeWindow }))
        fetchDerivedData()
      }
    }

    if (!pairData && !derivedPairData && pairId && !isLoading) {
      fetchAndUpdatePairPrice()
    }
  }, [
    pairId,
    timeWindow,
    pairData,
    currentSwapPrice,
    token0Address,
    token1Address,
    derivedPairData,
    dispatch,
    isLoading,
  ])

  const pairAddress = useLpAddress(token0Address, token1Address)
  useEffect(() => {
    const updatePairId = () => {
      try {
        const pa = pairAddress?.toLowerCase()
        if (pa !== pairId) {
          setPairId(pa)
        }
      } catch (error) {
        setPairId(null)
      }
    }

    updatePairId()
  }, [pairAddress, pairId])

  const normalizedPairData = useMemo(
    () => normalizePairDataByActiveToken({ activeToken: token0Address, pairData }),
    [token0Address, pairData],
  )

  const normalizedDerivedPairData = useMemo(
    () => normalizeDerivedPairDataByActiveToken({ activeToken: token0Address, pairData: derivedPairData }),
    [token0Address, derivedPairData],
  )

  const pairPrices = useMemo(() => {
    const hasSwapPrice = currentSwapPrice && currentSwapPrice[token0Address] > 0

    const normalizedPairDataWithCurrentSwapPrice =
      normalizedPairData?.length > 0 && hasSwapPrice
        ? [...normalizedPairData, { time: new Date(), value: currentSwapPrice[token0Address] }]
        : normalizedPairData

    const normalizedDerivedPairDataWithCurrentSwapPrice =
      normalizedDerivedPairData?.length > 0 && hasSwapPrice
        ? [...normalizedDerivedPairData, { time: new Date(), value: currentSwapPrice[token0Address] }]
        : normalizedDerivedPairData

    const hasNoDirectData =
      normalizedPairDataWithCurrentSwapPrice && normalizedPairDataWithCurrentSwapPrice?.length === 0
    const hasNoDerivedData =
      normalizedDerivedPairDataWithCurrentSwapPrice && normalizedDerivedPairDataWithCurrentSwapPrice?.length === 0

    if (normalizedPairDataWithCurrentSwapPrice && normalizedPairDataWithCurrentSwapPrice?.length > 0) {
      return normalizedPairDataWithCurrentSwapPrice
    }

    if (normalizedDerivedPairDataWithCurrentSwapPrice && normalizedDerivedPairDataWithCurrentSwapPrice?.length > 0) {
      return normalizedDerivedPairDataWithCurrentSwapPrice
    }

    // undefined is used for loading
    return hasNoDirectData && hasNoDerivedData ? [] : undefined
  }, [currentSwapPrice, normalizedDerivedPairData, normalizedPairData, token0Address])

  return { pairPrices, pairId }
}
