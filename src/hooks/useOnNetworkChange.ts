import React from 'react'
import { useActiveChainId } from './useActiveChainId'

const useOnNetworkChange = (fn: any) => {
  const { chainId } = useActiveChainId()
  const previousChainId = React.useRef(null)
  React.useEffect(() => {
    if (chainId) {
      if (previousChainId.current && previousChainId.current !== chainId) {
        fn()
      }
      previousChainId.current = chainId
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId])
  return null
}

export default useOnNetworkChange
