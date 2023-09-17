import React from 'react'
import { BASE_BSC_SCAN_URLS } from '../config/index'
import useActiveWeb3React from './useActiveWeb3React'

export const useClickTokenDetailHandler = () => {
  const { chainId } = useActiveWeb3React()
  const scanUrl = BASE_BSC_SCAN_URLS[chainId]

  return React.useCallback(
    (address: string) => {
      const win = window.open(`${scanUrl}/address/${address}`, '_blank')
      win.focus()
    },
    [scanUrl],
  )
}
