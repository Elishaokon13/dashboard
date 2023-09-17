import { useWeb3React } from 'wagmiUtil'
import { useRouter, NextRouter } from 'next/router'
import { useEffect } from 'react'
import { isChainSupported } from 'utils/wagmi'
import { getPublicClient } from '@wagmi/core'
import { useActiveChainId } from './useActiveChainId'
import { useSwitchNetworkLoading } from './useSwitchNetworkLoading'
import usePreviousValue from './usePreviousValue'
import { CHAIN_ID } from 'utils/getRpcUrl'

const getHashFromRouter = (router: NextRouter) => {
  return router.asPath.match(/#([a-z0-9]+)/gi)
}

export function useNetworkConnectorUpdater() {
  const { chainId } = useActiveWeb3React()
  const previousChainId = usePreviousValue(chainId)
  const [loading] = useSwitchNetworkLoading()
  const router = useRouter()

  useEffect(() => {
    if (loading || !router.isReady) return
    const parsedQueryChainId = Number(router.query.chainId)
    if (!parsedQueryChainId && chainId === CHAIN_ID) return
    if (parsedQueryChainId !== chainId && isChainSupported(chainId)) {
      const removeQueriesFromPath =
        previousChainId !== chainId &&
        ['/swap', '/limit-orders', 'liquidity', '/add', '/find', '/remove'].some((item) => {
          return router.pathname.startsWith(item)
        })
      const uriHash = getHashFromRouter(router)?.[0]
      router.replace(
        {
          query: {
            ...(!removeQueriesFromPath && router.query),
            chainId,
          },
          ...(uriHash && { hash: uriHash }),
        },
        undefined,
      )
    }
  }, [previousChainId, chainId, loading, router])
}

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = () => {
  const web3React = useWeb3React()
  const { chainId, isWrongNetwork } = useActiveChainId()
  const publicClient = getPublicClient({ chainId })

  return {
    publicClient,
    library: publicClient,
    ...web3React,
    chainId,
    isWrongNetwork,
  }
}

export default useActiveWeb3React
