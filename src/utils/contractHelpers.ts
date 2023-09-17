import { ChainId } from '@pancakeswap/chains'
import { viemClients } from 'utils/viem'
import { Abi, PublicClient, WalletClient, getContract as viemGetContract } from 'viem'
import { Address } from 'wagmi'
import { getLimitlessAddress } from './addressHelpers'
import limitlessAbi from 'config/abi/limitless.json'

export const getContract = <TAbi extends Abi | unknown[], TWalletClient extends WalletClient>({
  abi,
  address,
  chainId = ChainId.BSC,
  publicClient,
  signer,
}: {
  abi: TAbi
  address: Address
  chainId?: ChainId
  signer?: TWalletClient
  publicClient?: PublicClient
}) => {
  const c = viemGetContract({
    abi,
    address,
    publicClient: publicClient ?? viemClients[chainId],
    walletClient: signer,
  })
  return {
    ...c,
    account: signer?.account,
    chain: signer?.chain,
  }
}

export const getLimitlessContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: limitlessAbi,
    address: getLimitlessAddress(chainId),
    signer,
    chainId,
  })
}