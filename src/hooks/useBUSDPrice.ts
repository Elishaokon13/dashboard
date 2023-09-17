import React from 'react'
import { useAppDispatch } from 'state'
import { useLNTStatePrice } from 'state/global/hooks'
import { updateBNBPrice, updateLNTPrice } from '../state/global/actions'
import usePrice from 'hooks/usePrice'
import { lnt_token_address, lnt_pair_address, bnb_token_address, bnb_pair_address } from 'config/constants/addresses';

// since every page has limitless busd price, we can create a global poll and store token price in redux state to avoid extra calls
export const usePollLimitlessBusdPrice = () => {
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    Promise.all([
        usePrice(lnt_token_address, lnt_pair_address),
        usePrice(bnb_token_address, bnb_pair_address)
    ])
    .then((prices) => {
      dispatch(updateLNTPrice(Number(prices[0]*prices[1])))
    })
  }, [])
}

export const usePollBNBBusdPrice = () => {
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    Promise.all([usePrice(bnb_token_address, bnb_pair_address)])
      .then((prices) => {
        dispatch(updateBNBPrice(Number(prices[0])))
      })
  }, [])
}

export const useLimitlessBusdPrice = (): Number | undefined => {
  const cakeBusdPrice = useLNTStatePrice()
  return cakeBusdPrice
}

