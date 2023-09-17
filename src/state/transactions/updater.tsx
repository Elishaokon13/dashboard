import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrentBlock } from 'state/block/hooks'
import { ToastDescriptionWithTx } from 'components/Toast'
import useToast from 'hooks/useToast'
import { AppDispatch } from '../index'
import { checkedTransaction } from './actions'
import { useAllTransactions, usePostTransaction } from './hooks'

export function shouldCheck(
  currentBlock: number,
  tx: { addedTime: number; receipt?: any; lastCheckedBlockNumber?: number },
): boolean {
  if (tx.receipt) return false
  if (!tx.lastCheckedBlockNumber) return true
  const blocksSinceCheck = currentBlock - tx.lastCheckedBlockNumber
  if (blocksSinceCheck < 1) return false
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60
  if (minutesPending > 60) {
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9
  }
  if (minutesPending > 5) {
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2
  }
  // otherwise every block
  return true
}

export default function Updater(): null {
  const { library, chainId, account } = useActiveWeb3React()
  const { t } = useTranslation()

  const currentBlock = useCurrentBlock()

  const dispatch = useDispatch<AppDispatch>()

  const transactions = useAllTransactions()
  const { toastError, toastSuccess } = useToast()

  const postTransaction = usePostTransaction()

  useEffect(() => {
    if (!chainId || !library || !currentBlock) return

    Object.keys(transactions)
      .filter((hash) => shouldCheck(currentBlock, transactions[hash]))
      .forEach((hash) => {
        library
          .getTransactionReceipt(hash)
          .then((receipt) => {
            if (receipt) {
              dispatch(
                postTransaction({
                  chainId,
                  hash,
                  receipt: {
                    blockHash: receipt.blockHash,
                    blockNumber: receipt.blockNumber,
                    contractAddress: receipt.contractAddress,
                    from: receipt.from,
                    status: receipt.status,
                    to: receipt.to,
                    transactionHash: receipt.transactionHash,
                    transactionIndex: receipt.transactionIndex,
                  },
                }),
              )
              if (!transactions[hash].hideReceiptToast) {
                const toast = receipt.status === 1 ? toastSuccess : toastError
                toast(t('Transaction receipt'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
              }
            } else {
              dispatch(checkedTransaction({ chainId, hash, blockNumber: currentBlock, from: account }))
            }
          })
          .catch((error) => {
            console.error(`failed to check transaction hash: ${hash}`, error)
          })
      })
  }, [chainId, library, transactions, currentBlock, dispatch, toastSuccess, toastError, t, account, postTransaction])

  return null
}
