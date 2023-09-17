import { Contract } from '@ethersproject/contracts'
import type { Signer } from '@ethersproject/abstract-signer'
import type { Provider } from '@ethersproject/providers'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import ILimitlessRouterABI from 'config/abi/ILimitlessRouter.json'
import { ILimitlessRouter } from 'config/abi/types/ILimitlessRouter'
import { JSBI, Percent, CurrencyAmount, ChainId } from 'sdk'
import { CHAIN_ID } from 'config/constants/networks'
import { ROUTER_ADDRESS } from '../config/constants'
import { BASE_BSC_SCAN_URLS } from '../config'
import { simpleRpcProvider } from './providers'
import { provider } from './wagmi'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function getBscScanLink(
  data: string | number,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown' = 'token',
  chainIdOverride?: number,
): string {
  const chainId = chainIdOverride || CHAIN_ID
  switch (type) {
    case 'transaction': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/tx/${data}`
    }
    case 'token': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/token/${data}`
    }
    case 'block': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/block/${data}`
    }
    case 'countdown': {
      return `${BASE_BSC_SCAN_URLS[chainId]}/block/countdown/${data}`
    }
    default: {
      return `${BASE_BSC_SCAN_URLS[chainId]}/address/${data}`
    }
  }
}

export function getBscScanLinkForNft(collectionAddress: string, tokenId: string): string {
  const chainId = CHAIN_ID
  return `${BASE_BSC_SCAN_URLS[chainId]}/token/${collectionAddress}?a=${tokenId}`
}
// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000)),
  ]
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(
  address: string,
  ABI: any,
  signer?: Signer | Provider,
  chainId = ChainId.BSC,
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    return null
  }
  const signerOrProvider = signer ?? provider({ chainId })
  return new Contract(address, ABI, signerOrProvider)
}

// account is optional
export function getRouterContract(_: number, library: Web3Provider, account?: string) {
  return getContract(
    ROUTER_ADDRESS[CHAIN_ID],
    ILimitlessRouterABI,
    getProviderOrSigner(library, account),
  ) as ILimitlessRouter
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}
