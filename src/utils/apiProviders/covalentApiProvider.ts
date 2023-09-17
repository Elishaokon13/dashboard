import tokens from 'config/constants/tokens'

/* eslint-disable camelcase */
export interface HolderInfo {
  contract_decimals: number
  contract_name: string
  contract_ticker_symbol: string
  contract_address: string
  logo_url: string
  address: string
  balance: string
  total_supply: string
  block_height: number
}

/**
 * Covalent api to grab info of holders
 * for more info checkout here https://www.covalenthq.com/docs/api/#/0/Get%20token%20holders%20as%20of%20any%20block%20height/USD/56
 */
export const getHoldersInfo = (): Promise<HolderInfo[]> => {
  return fetch(
    `https://api.covalenthq.com/v1/56/tokens/${tokens.lnt.address}/token_holders/?quote-currency=USD&format=JSON&key=ckey_docs&page-size=9999999`,
  ).then(async (response) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const data = await response.json()

    return data.data.items as Promise<HolderInfo[]>
  })
}
