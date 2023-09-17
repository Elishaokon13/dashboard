import { formatEther } from '@ethersproject/units'
import { BigNumber } from '@ethersproject/bignumber'
import { ChainId } from '@pancakeswap/chains'
import { useMemo, useCallback } from 'react'
import limitlessAbi from 'config/abi/limitless.json'
import { useActiveChainId } from './useActiveChainId'
import { useAccount, useContractRead } from 'wagmi'
import { getLimitlessAddress } from 'utils/addressHelpers'
import { useLimitlessContract } from './useContract'
import useCatchTxError from 'hooks/useCatchTxError'

const formatHex = (hex: any): string => formatEther(BigNumber.from(hex).toString())

export const useLimitlessTokenBalance = (forceBSC?: boolean) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const { data, status, ...rest } = useContractRead({
    chainId: forceBSC ? ChainId.BSC : chainId,
    abi: limitlessAbi,
    address: getLimitlessAddress(),
    functionName: 'balanceOf',
    args: [account],
    enabled: !!account,
    watch: true,
  })
  return {
    ...rest,
    balanceFetchStatus: status,
    balance: useMemo(() => (typeof data !== 'undefined' ? formatHex(data) : null), [data]),
  }
}

export const useLimitlessDividendInfo = (forceBSC?: boolean) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const { data, status, ...rest } = useContractRead({
    chainId: forceBSC ? ChainId.BSC : chainId,
    abi: limitlessAbi,
    address: getLimitlessAddress(),
    functionName: 'getAccountDividendsInfo',
    args: [account],
    enabled: !!account,
    watch: true,
  })
  return {
    ...rest,
    dividendsFetchStatus: status,
    dividends: useMemo(() => (typeof data !== 'undefined' ? [formatHex(data[4]), formatHex(data[7])] : null), [data]),
  }
}

export const useLimitlessWithdrawable = (forceBSC?: boolean) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const { data, status, ...rest } = useContractRead({
    chainId: forceBSC ? ChainId.BSC : chainId,
    abi: limitlessAbi,
    address: getLimitlessAddress(),
    functionName: 'withdrawableDividendOf',
    args: [account],
    enabled: !!account,
    watch: true,
  })
  return {
    ...rest,
    withdrawableDividendsFetchStatus: status,
    withdrawableDividends: useMemo(() => (typeof data !== 'undefined' ? formatHex(data) : null), [data]),
  }
}

export const useLimitlessWithdraw = (fetchDividend: () => void) => {
  const contract = useLimitlessContract()
  const { fetchWithCatchTxError, loading: claimLoading } = useCatchTxError()

  const handleClaim = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() =>
      contract.write.claim()
    )
    if (receipt?.status) {
      fetchDividend()      
    }
  }, [fetchWithCatchTxError, contract.write])

  return { claimLoading, handleClaim }
}

