import { DIVIDENDS_CLIENT, INFO_CLIENT } from 'config/constants/endpoints'
import { GraphQLClient } from 'graphql-request'
import { ANALYTIC_URL } from 'sdk'

// Extra headers
// Mostly for dev environment
// No production env check since production preview might also need them
export const getGQLHeaders = (endpoint: string) => {
  return undefined
}

const infoClientsCache: {
  [chainId: number]: GraphQLClient
} = {}

export const getInfoClientByChainId = (chainId: number) => {
  if (!infoClientsCache[chainId]) {
    infoClientsCache[chainId] = new GraphQLClient(ANALYTIC_URL[chainId])
  }
  return infoClientsCache[chainId]
}

export const infoClient = new GraphQLClient(INFO_CLIENT)

export const dividendClient = new GraphQLClient(DIVIDENDS_CLIENT)

export const bitQueryServerClient = new GraphQLClient(process.env.NEXT_PUBLIC_BIT_QUERY_ENDPOINT, {
  headers: {
    // only server, no `NEXT_PUBLIC` not going to expose in client
    'X-API-KEY': process.env.BIT_QUERY_HEADER,
  },
  timeout: 5000,
})
