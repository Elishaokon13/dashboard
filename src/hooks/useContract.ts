import { useWalletClient } from 'wagmi'
import { useMemo } from 'react'
import { getLimitlessContract } from "utils/contractHelpers";


export const useLimitlessContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getLimitlessContract(signer), [signer])
}
