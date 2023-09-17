import { gql } from 'graphql-request'
import { useEffect, useRef, useState } from 'react'
import { EMPTY_ARRAY } from 'utils/constantObjects'
import { infoClient } from 'utils/graphql'

interface TopTokensResponse {
  tokens: {
    id: string
  }[]
}

/**
 * Tokens to display on Home page
 * The actual data is later requested in tokenData.ts
 * Note: dailyTxns_gt: 300 is there to prevent fetching incorrectly priced tokens with high dailyVolumeUSD
 */

const TOP_TOKENS = gql`
  query {
    tokens(first: 30, where: { totalTransactions_gte: 1 }, orderBy: tradeVolumeUSD, orderDirection: desc) {
      id
    }
  }
`
const fetchTopTokens = async (): Promise<string[]> => {
  try {
    const data = await infoClient.request<TopTokensResponse>(TOP_TOKENS)

    return data.tokens.map((t) => t.id)
  } catch (error) {
    console.error('Failed to fetch top tokens', error)
    return undefined
  }
}

/**
 * Fetch top addresses by volume
 */
const useTopTokenAddresses = (): string[] => {
  const [topTokenAddresses, setTopTokenAddresses] = useState<string[]>()
  const timeoutRef = useRef<{
    isNew: boolean
    timeout: ReturnType<typeof setTimeout>
  }>({ isNew: true, timeout: null })
  useEffect(() => {
    let isActive = true
    const fetch = async () => {
      const addresses = await fetchTopTokens()
      if (isActive) setTopTokenAddresses(addresses)
    }
    if (!topTokenAddresses) {
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
      isActive = false
    }
  }, [topTokenAddresses])

  return topTokenAddresses || EMPTY_ARRAY
}

export default useTopTokenAddresses
