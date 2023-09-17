import { useSelector } from 'react-redux'

import { AppState } from '../index'

export function useLNTStatePrice(): Number {
  return useSelector<AppState, AppState['global']['lnt']['price']>((state) => state.global.lnt.price)
}
export function useLNTStatePriceFixed(): string {
  return useSelector<AppState, AppState['global']['lnt']['fixedPrice']>((state) => state.global.lnt.fixedPrice)
}
export function useBNBStatePriceFixed(): string {
  return useSelector<AppState, AppState['global']['bnb']['fixedPrice']>((state) => state.global.bnb.fixedPrice)
}
