import { createReducer } from '@reduxjs/toolkit'
import { updateLNTPrice, updateBNBPrice } from './actions'

interface TokenPriceInfo {
  price: Number
  fixedPrice: string
}
export interface GlobalState {
  lnt: TokenPriceInfo
  bnb: TokenPriceInfo
}

const initialPriceInfo = {
  price: null,
  fixedPrice: '',
}

export const initialState: GlobalState = {
  lnt: initialPriceInfo,
  bnb: initialPriceInfo,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateLNTPrice, (state, { payload: price }) => {
      if (price) {
        state.lnt.price = price
        const fixedPrice = price.toFixed(6)        
        state.lnt.fixedPrice = Number(fixedPrice) ? fixedPrice : '<0.0000001'
      } else {
        state.lnt = initialPriceInfo
      }
    })
    .addCase(updateBNBPrice, (state, { payload: price }) => {
      if (price) {
        state.bnb.price = price
        const fixedPrice = price.toFixed(3)
        state.bnb.fixedPrice = Number(fixedPrice) ? fixedPrice : '<0.0001'
      } else {
        state.bnb = initialPriceInfo
      }
    }),
)
