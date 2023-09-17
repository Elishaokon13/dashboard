/* eslint-disable no-param-reassign */
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { TokenData } from 'state/info/types'
import { getInfoClientByChainId, infoClient } from 'utils/graphql'
import { useBlocksFromTimestamps } from 'views/Info/hooks/useBlocksFromTimestamps'
import { getPercentChange } from 'views/Info/utils/infoDataHelpers'
import { getDeltaTimestamps } from 'views/Info/utils/infoQueryHelpers'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ChainId, ETHER, Rounding } from 'sdk'
import useUsdPrice from 'hooks/useBUSDPrice'
import BigNumber from 'bignumber.js'

interface TokenFields {
  id: string
  symbol: string
  name: string
  derivedBNB: string // Price in BNB per token
  derivedUSD: string // Price in USD per token
  tradeVolumeUSD: string
  totalTransactions: string
  totalLiquidity: string
}

interface FormattedTokenFields
  extends Omit<TokenFields, 'derivedBNB' | 'derivedUSD' | 'tradeVolumeUSD' | 'totalTransactions' | 'totalLiquidity'> {
  derivedBNB: number
  derivedUSD: number
  tradeVolumeUSD: number
  totalTransactions: number
  totalLiquidity: number
}

interface TokenQueryResponse {
  now: TokenFields[]
  oneDayAgo: TokenFields[]
  twoDaysAgo: TokenFields[]
  oneWeekAgo: TokenFields[]
  twoWeeksAgo: TokenFields[]
}

/**
 * Main token data to display on Token page
 */
const TOKEN_AT_BLOCK = (block: number | undefined, tokens: string[], chainId: ChainId) => {
  const addressesString = `["${tokens.join('","')}"]`
  const blockString = block ? `block: {number: ${block}}` : ``

  if (chainId === ChainId.BSC) {
    return `tokens(
      where: {id_in: ${addressesString}}
      ${blockString}
      orderBy: tradeVolumeUSD
      orderDirection: desc
    ) {
      id
      symbol
      name
      derivedBNB
      derivedUSD
      tradeVolumeUSD
    }
  `
  }

  if (chainId === ChainId.Ethereum) {
    return `tokens(
      where: {id_in: ${addressesString}}
      ${blockString}
      orderBy: volumeUSD
      orderDirection: desc
    ) {
      id
      symbol
      name
      derivedBNB: derivedETH
      tradeVolumeUSD: volumeUSD
    }`
  }

  if (chainId === ChainId.Fantom) {
    return `tokens(
      where: {id_in: ${addressesString}}
      ${blockString}
      orderBy: tradeVolumeUSD
      orderDirection: desc
    ) {
      id
      symbol
      name
      derivedBNB: derivedETH
      tradeVolumeUSD
    }`
  }
  // todo

  return `tokens(
      where: {id_in: ${addressesString}}
      ${blockString}
      orderBy: volumeUSD
      orderDirection: desc
    ) {
      id
      symbol
      name
      derivedBNB: derivedMatic
      tradeVolumeUSD: volumeUSD
    }
  `
}

const fetchTokenData = async (
  block24h: number,
  block48h: number,
  block7d: number,
  block14d: number,
  tokenAddresses: string[],
  chainId: number,
) => {
  try {
    const query = gql`
      query tokens {
        now: ${TOKEN_AT_BLOCK(null, tokenAddresses, chainId)}
        oneDayAgo: ${TOKEN_AT_BLOCK(block24h, tokenAddresses, chainId)}
        twoDaysAgo: ${TOKEN_AT_BLOCK(block48h, tokenAddresses, chainId)}
        oneWeekAgo: ${TOKEN_AT_BLOCK(block7d, tokenAddresses, chainId)}
        twoWeeksAgo: ${TOKEN_AT_BLOCK(block14d, tokenAddresses, chainId)}
      }
    `
    const data = await getInfoClientByChainId(chainId).request<TokenQueryResponse>(query)
    return { data, error: false }
  } catch (error) {
    console.error('Failed to fetch token data', error)
    return { error: true }
  }
}

// Transforms tokens into "0xADDRESS: { ...TokenFields }" format and cast strings to numbers
const parseTokenData = (tokens?: TokenFields[], ethPriceFixed?: string) => {
  if (!tokens) {
    return {}
  }
  return tokens.reduce((accum: { [address: string]: FormattedTokenFields }, tokenData) => {
    const { derivedBNB, derivedUSD, tradeVolumeUSD, totalTransactions, totalLiquidity } = tokenData

    accum[tokenData.id] = {
      ...tokenData,
      derivedBNB: parseFloat(derivedBNB),
      derivedUSD: derivedUSD ? parseFloat(derivedUSD) : new BigNumber(ethPriceFixed).times(derivedBNB).toNumber(),
      tradeVolumeUSD: parseFloat(tradeVolumeUSD),
      totalTransactions: parseFloat(totalTransactions),
      totalLiquidity: parseFloat(totalLiquidity),
    }
    return accum
  }, {})
}

interface TokenDatas {
  error: boolean
  data?: {
    [address: string]: TokenData
  }
}
/**
 * Fetch top addresses by volume
 */
const useFetchedTokenDatas = (tokenAddresses: string[]): TokenDatas => {
  const [fetchState, setFetchState] = useState<TokenDatas>({ error: false })
  const [t24h, t48h, t7d, t14d] = getDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24h, t48h, t7d, t14d])
  const [block24h, block48h, block7d, block14d] = blocks ?? []
  const { chainId } = useActiveChainId()

  const ethPrice = useUsdPrice(ETHER[chainId])
  const ethPriceFixed = ethPrice?.toFixed(4, undefined, Rounding.ROUND_DOWN)
  useEffect(() => {
    let isActive = true
    const fetch = async () => {
      const { error, data } = await fetchTokenData(
        block24h.number,
        block48h.number,
        block7d.number,
        block14d.number,
        tokenAddresses,
        chainId,
      )
      if (isActive) {
        if (error) {
          setFetchState({ error: true })
        } else {
          const parsed = parseTokenData(data?.now, ethPriceFixed)
          const parsed24 = parseTokenData(data?.oneDayAgo, ethPriceFixed)
          const parsed7d = parseTokenData(data?.oneWeekAgo, ethPriceFixed)
          // Calculate data and format
          const formatted = tokenAddresses.reduce((accum: { [address: string]: TokenData }, address) => {
            // if (address.toLowerCase() === tokenLists.lnt.address.toLowerCase()) {
            //   accum[address] = {
            //     exists: true,
            //     address,
            //     name: tokenLists.lnt.name,
            //     symbol: tokenLists.lnt.symbol,
            //     volumeUSD: 0,
            //     priceUSD: Number(lntPrice),
            //     priceUSDChange: 0,
            //     priceUSDChangeWeek: 0,
            //   }
            // } else {
            const current: FormattedTokenFields | undefined = parsed[address]
            const oneDay: FormattedTokenFields | undefined = parsed24[address]
            const week: FormattedTokenFields | undefined = parsed7d[address]
            // Prices of tokens for now, 24h ago and 7d ago
            const priceUSD = current ? current.derivedUSD ?? current.derivedBNB : 0
            const priceUSDOneDay = oneDay ? oneDay.derivedUSD : 0
            const priceUSDWeek = week ? week.derivedUSD : 0
            const priceUSDChange = getPercentChange(priceUSD, priceUSDOneDay)
            const priceUSDChangeWeek = getPercentChange(priceUSD, priceUSDWeek)

            accum[address] = {
              exists: true,
              address,
              name: current && current.name !== 'unknown' ? current.name : '',
              symbol: current && current.symbol !== 'unknown' ? current.symbol : '',
              volumeUSD: 0,
              priceUSD: priceUSD || undefined,
              priceUSDChange,
              priceUSDChangeWeek,
            }
            // }

            return accum
          }, {})

          setFetchState({ data: formatted, error: false })
        }
      }
    }
    const allBlocksAvailable = block24h?.number && block48h?.number && block7d?.number && block14d?.number
    if (tokenAddresses.length > 0 && allBlocksAvailable && !blockError && chainId) {
      fetch()
    }
    return () => {
      isActive = false
    }
  }, [tokenAddresses, block24h, block48h, block7d, block14d, blockError, chainId, ethPrice, ethPriceFixed])

  return fetchState
}
export default useFetchedTokenDatas
