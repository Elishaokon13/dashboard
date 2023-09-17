import { Token } from 'sdk'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { EMPTY_OBJECT } from 'utils/constantObjects'
import { useRouter } from 'next/router'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { AppDispatch, AppState, useAppDispatch } from '../index'
import { fetchDefaultTokenList, WrappedTokenInfo, ExtendedTokenInfo, TokenAddressMap, EMPTY_LIST } from './actions'

export { WrappedTokenInfo }
export type { ExtendedTokenInfo, TokenAddressMap }

export function useIsListFetched(): boolean {
  return useSelector<AppState, boolean>((state) => {
    return state.lists.fetched
  })
}

export function useTokenSelector(address: string): Token | null {
  const { chainId } = useActiveWeb3React()
  const loweredAddr = address.toLowerCase()
  return useSelector<AppState, Token | null>((state) => {
    return (
      state.lists.byChainId[chainId]?.defaultList?.[loweredAddr] ||
      state.lists.byChainId[chainId]?.addedList?.[loweredAddr]
    )
  })
}

// list of tokens not supported on interface, used to show warnings and prevent swaps and adds
export function useUnsupportedTokenList(): TokenAddressMap {
  return EMPTY_LIST
}

export function useStateDefaultList(): { [address: string]: Token } {
  const dispatch = useDispatch<AppDispatch>()

  const { chainId } = useActiveWeb3React()

  const pathname = useRouter()?.pathname

  const selectorKey = useMemo(() => {
    if (
      pathname.includes('/add/[[...currency]]') ||
      pathname.includes('/remote/[[...currency]]') ||
      pathname.includes('/liquidity')
    ) {
      return 'liquidityList'
    }

    if (pathname.includes('/swap')) {
      return 'swapList'
    }

    return 'defaultList'
  }, [pathname])

  const defaultList = useSelector<AppState, { [address: string]: Token }>((state) => {
    return state.lists.byChainId[chainId]?.[selectorKey]
  })

  useEffect(() => {
    if (!defaultList) {
      dispatch(fetchDefaultTokenList())
    }
  }, [defaultList, dispatch])

  return defaultList || EMPTY_OBJECT
}

export const usePollDefaultTokenList = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchDefaultTokenList())
  }, [dispatch])
}
