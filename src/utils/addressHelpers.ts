import { ChainId } from 'sdk'
import addresses from 'config/constants/contracts'

export interface Addresses {
  [chainId: number]: `0x${string}`
}

export const getAddressFromMap = (address: Addresses, chainId?: number): `0x${string}` => {
  return address[chainId] ? address[chainId] : address[ChainId.BSC]
}

export const getLimitlessAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.limitless, chainId)
}