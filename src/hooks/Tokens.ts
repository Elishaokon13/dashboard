/* eslint-disable no-param-reassign */
import { Currency, Token, ETHER } from 'sdk'
import { useEffect, useMemo, useRef } from 'react'
import { fetchTokenFromContract } from 'state/lists/actions'
import { useAppDispatch } from 'state'
import { TokenAddressMap, useUnsupportedTokenList, useStateDefaultList, useTokenSelector } from '../state/lists/hooks'
import { isAddress } from '../utils'
import useActiveWeb3React from './useActiveWeb3React'

// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function getTokensFromMap(tokenMap: TokenAddressMap): { [address: string]: Token } {
  return {}

  // // reduce to just tokens
  // const mapWithoutUrls = Object.keys(tokenMap[chainId]).reduce<{ [address: string]: Token }>((newMap, address) => {
  //   newMap[address] = tokenMap[chainId][address].token
  //   return newMap
  // }, {})

  // return mapWithoutUrls
}

export function useDefaultTokens(): { [address: string]: Token } {
  return useStateDefaultList()
}

export function useAllTokens(): { [address: string]: Token } {
  return useDefaultTokens()
}

export function useUnsupportedTokens(): { [address: string]: Token } {
  const unsupportedTokensMap = useUnsupportedTokenList()
  return useMemo(() => getTokensFromMap(unsupportedTokensMap), [unsupportedTokensMap])
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token

export function useToken(tokenAddress?: string): Token | undefined | null {
  const { chainId } = useActiveWeb3React()
  const tokenRef = useRef<Token>(null)
  const address = useMemo(() => isAddress(tokenAddress), [tokenAddress])
  const loweredAddress = String(address).toLowerCase()

  const selectedToken = useTokenSelector(
    tokenRef.current?.address?.toLowerCase() === loweredAddress && tokenRef?.current?.chainId === chainId
      ? ''
      : loweredAddress,
  )
  const token = useMemo(() => {
    if (!tokenAddress) {
      tokenRef.current = null
    } else if (selectedToken) {
      tokenRef.current = selectedToken
      return selectedToken
    }

    return tokenRef.current
  }, [selectedToken, tokenAddress])

  const dispatch = useAppDispatch()
  useEffect(() => {
    if (!token && address) {
      dispatch(fetchTokenFromContract({ address: address.toLowerCase(), chainId }))
    }
  }, [token, address, dispatch, chainId])
  return token
}

export function useCurrency(currencyId: string | undefined): Currency | null | undefined {
  const { chainId } = useActiveWeb3React()
  const eth = ETHER[chainId]
  const isEth = currencyId?.toUpperCase() === eth?.symbol
  const token = useToken(isEth ? undefined : currencyId)
  return isEth ? eth : token
}
