/* eslint-disable camelcase */

export interface NomicsTicker {
  price_change_pct: string
}

export interface NomicsCurrency {
  id: string
  currency: string
  symbol: string
  name: string
  logo_url: string
  status: string
  platform_currency: string
  price: string
  price_date: string
  price_timestamp: string
  circulating_supply: string
  max_supply: string
  market_cap: string
  market_cap_dominance: string
  num_exchanges: string
  num_pairs: string
  num_pairs_unmapped: string
  first_candle: string
  first_trade: string
  first_order_book: string
  first_priced_at: string
  rank: string
  high: string
  high_timestamp: string
  '1h': NomicsTicker
  '1d': NomicsTicker
  '7d': NomicsTicker
  '30d': NomicsTicker
  '365d': NomicsTicker
  ytd: NomicsTicker
}

/**
 * Nomics api to grab currency info
 * for more info checkout here https://nomics.com/docs/#tag/Currencies
 */
export const getCurrenciesTicker = (): Promise<NomicsCurrency[]> => {
  return fetch(`/api/nomics`).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.json() as Promise<NomicsCurrency[]>
  })
}
