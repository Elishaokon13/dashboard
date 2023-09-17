import { TransactionResponse } from '@ethersproject/providers'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { EMPTY_OBJECT } from 'utils/constantObjects'
import { ChainId, ETHER } from 'sdk'
import useBUSDPrice from 'hooks/useBUSDPrice'
import { AppDispatch, AppState } from '../index'
import { addTransaction, finalizeTransaction, postTransaction, SerializableTransactionReceipt } from './actions'
import { TransactionDetails } from './reducer'
import BigNumber from 'bignumber.js'

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTransactionAdder(): (
  response: TransactionResponse,
  customData?: {
    hideReceiptToast?: boolean
    summary?: string
    approval?: { tokenAddress: string; spender: string }
    claim?: { recipient: string }
    data?: any
  },
) => void {
  const { chainId, account } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const ethPrice = useBUSDPrice(chainId && ETHER[chainId])
  return useCallback(
    (
      response: TransactionResponse,
      {
        summary,
        approval,
        claim,
        hideReceiptToast,
        data,
      }: {
        hideReceiptToast?: boolean
        summary?: string
        claim?: { recipient: string }
        approval?: { tokenAddress: string; spender: string }
        data?: any
      } = {},
    ) => {
      if (!account) return
      if (!chainId) return

      const { hash } = response
      if (!hash) {
        throw Error('No transaction hash found.')
      }
      if (data) {
        dispatch(postTransaction(hash, data, ethPrice))
      }
      dispatch(addTransaction({ hash, from: account, chainId, approval, summary, claim, hideReceiptToast }))
    },
    [dispatch, chainId, account, ethPrice],
  )
}

// returns all the transactions for the current chain
export function useAllTransactions(): { [txHash: string]: TransactionDetails } {
  const { chainId, account } = useActiveWeb3React()

  const state = useSelector<AppState, AppState['transactions']>((s) => s.transactions)
  return useMemo(() => (chainId ? state[chainId]?.[account] ?? EMPTY_OBJECT : EMPTY_OBJECT), [chainId, state, account])
}

export const usePostTransaction = () => {
  return useCallback(
    (transaction: { chainId: ChainId; hash: string; receipt: SerializableTransactionReceipt }) => (dispatch) => {
      dispatch(finalizeTransaction(transaction))
    },
    [],
  )
}

export function useIsTransactionPending(transactionHash?: string): boolean {
  const transactions = useAllTransactions()

  if (!transactionHash || !transactions[transactionHash]) return false

  return !transactions[transactionHash].receipt
}

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionRecent(tx: TransactionDetails): boolean {
  return new Date().getTime() - tx.addedTime < 86_400_000
}

// returns whether a token has a pending approval transaction
export function useHasPendingApproval(tokenAddress: string | undefined, spender: string | undefined): boolean {
  const allTransactions = useAllTransactions()
  return useMemo(
    () =>
      typeof tokenAddress === 'string' &&
      typeof spender === 'string' &&
      Object.keys(allTransactions).some((hash) => {
        const tx = allTransactions[hash]
        if (!tx) return false
        if (tx.receipt) {
          return false
        }
        const { approval } = tx
        if (!approval) return false
        return approval.spender === spender && approval.tokenAddress === tokenAddress && isTransactionRecent(tx)
      }),
    [allTransactions, spender, tokenAddress],
  )
}

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

// calculate pending transactions
export function usePendingTransactions(): { hasPendingTransactions: boolean; pendingNumber: number } {
  const allTransactions = useAllTransactions()
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
  const hasPendingTransactions = !!pending.length

  return {
    hasPendingTransactions,
    pendingNumber: pending.length,
  }
}
