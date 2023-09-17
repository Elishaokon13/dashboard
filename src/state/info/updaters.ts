import React, { useEffect, useMemo } from 'react'
import useTopPoolAddresses from 'state/info/queries/pools/topPools'
import usePoolDatas from 'state/info/queries/pools/poolData'
import useFetchedTokenDatas from 'state/info/queries/tokens/tokenData'
import {
  useUpdatePoolData,
  useAllPoolData,
  useAddPoolKeys,
  useAllTokenData,
  useUpdateTokenData,
  useProtocolDividendTransactions,
  useProtocolDividendChartData,
  useAddTopToken,
} from './hooks'
import { fetchDividendChartData, fetchTopDividendTransactions } from './queries/protocol/dividends'

export const ProtocolUpdater: React.FC = () => {
  // const [protocolData, setProtocolData] = useProtocolData()
  // const { data: fetchedProtocolData, error } = useFetchProtocolData()
  // const [chartData, updateChartData] = useProtocolChartData()
  // const { data: fetchedChartData, error: chartError } = useFetchGlobalChartData()

  // const [transactions, updateTransactions] = useProtocolTransactions()
  const [dividendTransactions, updateDividendTransactions] = useProtocolDividendTransactions()
  const [dividendChartData, updateDividendChartData] = useProtocolDividendChartData()

  // update overview data if available and not set
  // useEffect(() => {
  //   if (protocolData === undefined && fetchedProtocolData && !error) {
  //     setProtocolData(fetchedProtocolData)
  //   }
  // }, [error, fetchedProtocolData, protocolData, setProtocolData])

  // update global chart data if available and not set
  // useEffect(() => {
  //   if (chartData === undefined && fetchedChartData && !chartError) {
  //     updateChartData(fetchedChartData)
  //   }
  // }, [chartData, chartError, fetchedChartData, updateChartData])

  // useEffect(() => {
  //   let active = true
  //   const fetch = async () => {
  //     const data = await fetchTopTransactions()
  //     if (data && active) {
  //       // this cause memory leak when switch page before fetch completed
  //       // Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application
  //       updateTransactions(data)
  //     }
  //   }
  //   if (!transactions) {
  //     fetch()
  //   }
  //   return () => {
  //     // unmounted
  //     active = false
  //   }
  // }, [transactions, updateTransactions])

  useEffect(() => {
    let active = true
    const fetch = async () => {
      const data = await fetchTopDividendTransactions()
      if (data && active) {
        // this cause memory leak when switch page before fetch completed
        // Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application
        updateDividendTransactions(data)
      }
    }
    if (!dividendTransactions) {
      fetch()
    }
    return () => {
      // unmounted
      active = false
    }
  }, [dividendTransactions, updateDividendTransactions])

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchDividendChartData()
      if (data) {
        updateDividendChartData(data)
      }
    }
    if (!dividendChartData) {
      fetch()
    }
  }, [dividendChartData, updateDividendChartData])

  return null
}

export const TokenUpdater = (): null => {
  const updateTokenDatas = useUpdateTokenData()
  useAddTopToken()

  const allTokenData = useAllTokenData()

  // detect for which addresses we havent loaded token data yet
  const unfetchedTokenAddresses = useMemo(() => {
    return Object.keys(allTokenData).reduce((accum: string[], key) => {
      const tokenData = allTokenData[key]
      if (!tokenData.data) {
        accum.push(key)
      }
      return accum
    }, [])
  }, [allTokenData])

  // fetch data for unfetched tokens and update them
  const { error: tokenDataError, data: tokenDatas } = useFetchedTokenDatas(unfetchedTokenAddresses)
  useEffect(() => {
    if (tokenDatas && !tokenDataError) {
      updateTokenDatas(Object.values(tokenDatas))
    }
  }, [tokenDataError, tokenDatas, updateTokenDatas])

  return null
}
