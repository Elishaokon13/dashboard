/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'
import {
  addTransaction,
  checkedTransaction,
  clearAllTransactions,
  finalizeTransaction,
  SerializableTransactionReceipt,
} from './actions'

const now = () => new Date().getTime()

export interface TransactionDetails {
  hash: string
  approval?: { tokenAddress: string; spender: string }
  summary?: string
  claim?: { recipient: string }
  receipt?: SerializableTransactionReceipt
  lastCheckedBlockNumber?: number
  addedTime: number
  confirmedTime?: number
  from: string
  hideReceiptToast?: boolean
  data?: any
}

export interface TransactionState {
  [chainId: number]: {
    [account: string]: {
      [txHash: string]: TransactionDetails
    }
  }
}

export const initialState: TransactionState = {}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(
      addTransaction,
      (transactions, { payload: { chainId, from, hash, approval, summary, claim, hideReceiptToast, data } }) => {
        if (transactions[chainId]?.[from]?.[hash]) {
          throw Error('Attempted to add existing transaction.')
        }
        if (!transactions[chainId]) {
          transactions[chainId] = {}
        }
        const txs = transactions[chainId]?.[from] ?? {}
        txs[hash] = { hash, approval, summary, claim, from, addedTime: now(), hideReceiptToast, data }
        transactions[chainId][from] = txs
      },
    )
    .addCase(clearAllTransactions, (transactions, { payload: { chainId, from } }) => {
      if (!transactions[chainId]?.[from]) return
      transactions[chainId][from] = {}
    })
    .addCase(checkedTransaction, (transactions, { payload: { chainId, hash, blockNumber, from } }) => {
      const tx = transactions[chainId]?.[from]?.[hash]
      if (!tx) {
        return
      }
      if (!tx.lastCheckedBlockNumber) {
        tx.lastCheckedBlockNumber = blockNumber
      } else {
        tx.lastCheckedBlockNumber = Math.max(blockNumber, tx.lastCheckedBlockNumber)
      }
    })
    .addCase(finalizeTransaction, (transactions, { payload: { hash, chainId, receipt } }) => {
      const tx = transactions[chainId]?.[receipt?.from]?.[hash]
      if (!tx) {
        return
      }
      tx.receipt = receipt
      tx.confirmedTime = now()
    }),
)
