import { createAction } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { ChainId, Price } from 'sdk'
import { log } from 'next-axiom'

export interface SerializableTransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  blockHash: string
  transactionHash: string
  blockNumber: number
  status?: number
}

export const postTransaction = (txn: string, data: any, ethPrice: Price) => async () => {
  try {
    const { ethValue, ...rest } = data

    log.info(`Transaction post: ${txn}`)

    fetch('/api/transaction', {
      body: btoa(
        JSON.stringify({
          ...rest,
          dollarValue: ethValue
            .times(ethPrice?.toSignificant() ?? 0)
            .decimalPlaces(3, BigNumber.ROUND_CEIL)
            .toNumber(),
        }),
      ),
      method: 'POST',
    })
      .then(() => {
        log.info(`Transaction post back successfully: ${txn}`)
      })
      .catch((ex: any) => {
        log.error(`Transaction post failed: ${txn}`)
        log.error(ex)
      })
  } catch (ex: any) {
    log.error(`Transaction post failed while construct payload: ${txn}`)
    log.error(ex)
  }
}

export const addTransaction = createAction<{
  chainId: ChainId
  hash: string
  from: string
  approval?: { tokenAddress: string; spender: string }
  claim?: { recipient: string }
  summary?: string
  hideReceiptToast?: boolean
  data?: any
}>('transactions/addTransaction')
export const clearAllTransactions = createAction<{ chainId: ChainId; from: string }>(
  'transactions/clearAllTransactions',
)
export const finalizeTransaction = createAction<{
  chainId: ChainId
  hash: string
  receipt: SerializableTransactionReceipt
}>('transactions/finalizeTransaction')

export const checkedTransaction = createAction<{
  chainId: ChainId
  hash: string
  blockNumber: number
  from: string
}>('transactions/checkedTransaction')
