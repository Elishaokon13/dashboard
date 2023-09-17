/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'
import { InfoState } from './types'
import {
  updateProtocolData,
  updateProtocolChartData,
  updateProtocolTransactions,
  updatePoolData,
  addPoolKeys,
  updatePoolChartData,
  updatePoolTransactions,
  updateTokenData,
  addTokenKeys,
  updateTokenPriceData,
  updateProtocolDividendChartData,
  updateProtocolDividendTransactions,
  addTopTokensByChain,
} from './actions'

const initialState: InfoState = {
  protocol: {},
  pools: { byAddress: {} },
  tokens: {},
}

export default createReducer(initialState, (builder) =>
  builder
    // Protocol actions
    .addCase(updateProtocolData, (state, { payload: { protocolData } }) => {
      state.protocol.overview = protocolData
    })
    .addCase(updateProtocolChartData, (state, { payload: { chartData } }) => {
      state.protocol.chartData = chartData
    })
    .addCase(updateProtocolTransactions, (state, { payload: { transactions } }) => {
      state.protocol.transactions = transactions
    })
    .addCase(updateProtocolDividendChartData, (state, { payload: { dividendChartData } }) => {
      state.protocol.dividendChartData = dividendChartData
    })
    .addCase(updateProtocolDividendTransactions, (state, { payload: { dtransactions } }) => {
      state.protocol.dividendTransactions = dtransactions
    })
    // Pools actions
    .addCase(updatePoolData, (state, { payload: { pools } }) => {
      pools.forEach((poolData) => {
        state.pools.byAddress[poolData.address] = {
          ...state.pools.byAddress[poolData.address],
          data: poolData,
        }
      })
    })
    .addCase(addPoolKeys, (state, { payload: { poolAddresses } }) => {
      poolAddresses.forEach((address) => {
        if (!state.pools.byAddress[address]) {
          state.pools.byAddress[address] = {
            data: undefined,
            chartData: undefined,
            transactions: undefined,
          }
        }
      })
    })
    .addCase(updatePoolChartData, (state, { payload: { poolAddress, chartData } }) => {
      state.pools.byAddress[poolAddress] = { ...state.pools.byAddress[poolAddress], chartData }
    })
    .addCase(updatePoolTransactions, (state, { payload: { poolAddress, transactions } }) => {
      state.pools.byAddress[poolAddress] = { ...state.pools.byAddress[poolAddress], transactions }
    })
    // Tokens actions
    .addCase(updateTokenData, (state, { payload: { tokens, chainId } }) => {
      tokens.forEach((tokenData) => {
        if (state.tokens[chainId])
          state.tokens[chainId].byAddress[tokenData.address] = {
            ...state.tokens[chainId].byAddress[tokenData.address],
            data: {
              ...tokenData,
              volumeUSD: state.tokens[chainId].topTokens[tokenData.address]?.volume ?? 0,
            },
          }
      })
    })
    .addCase(addTopTokensByChain, (state, { payload: { topTokens, chainId } }) => {
      if (!state.tokens[chainId]) {
        state.tokens[chainId] = { byAddress: {}, topTokens: {} }
      }
      const chainState = state.tokens[chainId]

      topTokens.forEach((data) => {
        const { address } = data
        const loweredAddress = address.toLowerCase()
        chainState.topTokens[loweredAddress] = data
        chainState.byAddress[loweredAddress] = {
          poolAddresses: undefined,
          data: undefined,
          chartData: undefined,
          priceData: {},
          transactions: undefined,
        }
      })
    })
    .addCase(addTokenKeys, (state, { payload: { tokenAddresses, chainId } }) => {
      if (!state.tokens[chainId]) {
        state.tokens[chainId] = { byAddress: {}, topTokens: {} }
      }
      tokenAddresses.forEach((address) => {
        if (!state.tokens[chainId].byAddress[address]) {
          state.tokens[chainId].byAddress[address] = {
            poolAddresses: undefined,
            data: undefined,
            chartData: undefined,
            priceData: {},
            transactions: undefined,
          }
        }
      })
    })

    .addCase(
      updateTokenPriceData,
      (state, { payload: { chainId, tokenAddress, secondsInterval, priceData, oldestFetchedTimestamp } }) => {
        state.tokens[chainId].byAddress[tokenAddress] = {
          ...state.tokens[chainId].byAddress[tokenAddress],
          priceData: {
            ...state.tokens[chainId].byAddress[tokenAddress]?.priceData,
            [secondsInterval]: priceData,
            oldestFetchedTimestamp,
          },
        }
      },
    ),
)
