import { Currency, Token, ETHER } from 'sdk'

export function currencyId(currency: Currency): string {
  if (currency === ETHER[currency?.chainId]) return ETHER[currency?.chainId]?.symbol
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}

export default currencyId
