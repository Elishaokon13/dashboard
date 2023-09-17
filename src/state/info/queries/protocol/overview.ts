import { gql } from 'graphql-request'
import { useEffect, useRef, useState } from 'react'
import { ProtocolData } from 'state/info/types'
import { infoClient } from 'utils/graphql'
import { useBlocksFromTimestamps } from 'views/Info/hooks/useBlocksFromTimestamps'
import { getChangeForPeriod, getPercentChange } from 'views/Info/utils/infoDataHelpers'
import { getDeltaTimestamps } from 'views/Info/utils/infoQueryHelpers'

interface LimitlessFactory {
  totalTransactions: string
  totalVolumeUSD: string
  totalLiquidityUSD: string
}

interface OverviewResponse {
  limitlessFactories: LimitlessFactory[]
}

/**
 * Latest Liquidity, Volume and Transaction count
 */
const getOverviewData = async (block?: number): Promise<{ data?: OverviewResponse; error: boolean }> => {
  try {
    const query = gql`query overview {
      limitlessFactories(
        ${block ? `block: { number: ${block}}` : ``}
        first: 1) {
        totalTransactions
        totalVolumeUSD
        totalLiquidityUSD
      }
    }`
    const data = await infoClient.request<OverviewResponse>(query)
    return { data, error: false }
  } catch (error) {
    console.error('Failed to fetch info overview', error)
    return { data: null, error: true }
  }
}

const formatLimitlessFactoryResponse = (rawLimitlessFactory?: LimitlessFactory) => {
  if (rawLimitlessFactory) {
    return {
      totalTransactions: parseFloat(rawLimitlessFactory.totalTransactions),
      totalVolumeUSD: parseFloat(rawLimitlessFactory.totalVolumeUSD),
      totalLiquidityUSD: parseFloat(rawLimitlessFactory.totalLiquidityUSD),
    }
  }
  return null
}

interface ProtocolFetchState {
  error: boolean
  data?: ProtocolData
}

const useFetchProtocolData = (): ProtocolFetchState => {
  const [fetchState, setFetchState] = useState<ProtocolFetchState>({
    error: false,
  })
  const [t24, t48] = getDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48])
  const [block24, block48] = blocks ?? []
  const timeoutRef = useRef<{
    isNew: boolean
    timeout: ReturnType<typeof setTimeout>
  }>({ isNew: true, timeout: null })
  useEffect(() => {
    let active = true
    const fetch = async () => {
      const { error, data } = await getOverviewData()
      const { error: error24, data: data24 } = await getOverviewData(block24?.number ?? undefined)
      const { error: error48, data: data48 } = await getOverviewData(block48?.number ?? undefined)
      if (active) {
        const anyError = error || error24 || error48
        const overviewData = formatLimitlessFactoryResponse(data?.limitlessFactories?.[0])
        const overviewData24 = formatLimitlessFactoryResponse(data24?.limitlessFactories?.[0])
        const overviewData48 = formatLimitlessFactoryResponse(data48?.limitlessFactories?.[0])
        if (anyError) {
          setFetchState({
            error: true,
          })
        } else {
          const [volumeUSD, volumeUSDChange] = getChangeForPeriod(
            overviewData?.totalVolumeUSD ?? 0,
            overviewData24?.totalVolumeUSD ?? 0,
            overviewData48?.totalVolumeUSD ?? 0,
          )
          const liquidityUSDChange = getPercentChange(
            overviewData?.totalLiquidityUSD,
            overviewData24?.totalLiquidityUSD,
          )
          // 24H transactions
          const [txCount, txCountChange] = getChangeForPeriod(
            overviewData?.totalTransactions ?? 0,
            overviewData24?.totalTransactions ?? 0,
            overviewData48?.totalTransactions ?? 0,
          )
          const protocolData: ProtocolData = {
            volumeUSD,
            volumeUSDChange: typeof volumeUSDChange === 'number' ? volumeUSDChange : 0,
            liquidityUSD: overviewData?.totalLiquidityUSD,
            liquidityUSDChange,
            txCount,
            txCountChange,
          }
          setFetchState({
            error: false,
            data: protocolData,
          })
        }
      }
    }
    const allBlocksAvailable = block24?.number && block48?.number
    if (allBlocksAvailable && !blockError && !fetchState.data) {
      if (timeoutRef.current.isNew) {
        fetch()
        timeoutRef.current.isNew = false
      } else {
        clearTimeout(timeoutRef.current.timeout)
        timeoutRef.current.timeout = setTimeout(() => {
          fetch()
          // refetch after 5 seconds in case of error
        }, 5000)
      }
    }

    return () => {
      active = false
    }
  }, [block24, block48, blockError, fetchState])

  return fetchState
}

export default useFetchProtocolData
