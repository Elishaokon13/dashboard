import { ChainId, Token } from 'sdk'
import { createReducer } from '@reduxjs/toolkit'
import { WrappedTokenInfo, fetchDefaultTokenList, fetchTokenFromContract, addCacheToken } from './actions'
import { selectCurrency } from 'state/swap/actions'

export interface ListsState {
  byChainId: {
    [chainId in ChainId]?: {
      defaultList: { [address: string]: Token }
      liquidityList: { [address: string]: Token }
      swapList: { [address: string]: Token }
      addedList: { [address: string]: Token }
    }
  }
  loading: boolean
  fetched: boolean
}

const initialState: ListsState = {
  byChainId: {},
  loading: false,
  fetched: false,
}

const tryInitAddedList = (state, chainId) => {
  if (!state.byChainId[chainId]) {
    state.byChainId[chainId] = {}
  }

  if (!state.byChainId[chainId].addedList) {
    state.byChainId[chainId].addedList = {}
  }
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(addCacheToken, (state, { payload: { chainId, cacheToken } }) => {
      if (cacheToken) {
        const loweredAddr = cacheToken.address.toLowerCase()
        state.byChainId[chainId].defaultList[loweredAddr] = cacheToken
        state.byChainId[chainId].swapList[loweredAddr] = cacheToken
      }
    })
    .addCase(fetchDefaultTokenList.fulfilled, (state, action) => {
      Object.entries(action.payload).forEach(([chainId, list]) => {
        let listState = state.byChainId[chainId]
        if (!listState) {
          listState = {}
          state.byChainId[chainId] = listState
        }
        listState.defaultList = list
        if (list) {
          listState.liquidityList = Object.entries(list as { [address: string]: WrappedTokenInfo }).reduce(
            (acc, [key, val]) => {
              if (val?.tokenInfo?.render === 'liquidity' || val?.tokenInfo?.render === 'both') {
                // eslint-disable-next-line no-param-reassign
                acc[key] = val
              }

              return acc
            },
            {},
          )
          listState.swapList = Object.entries(list as { [address: string]: WrappedTokenInfo }).reduce(
            (acc, [key, val]) => {
              if (val?.tokenInfo?.render === 'swap' || val?.tokenInfo?.render === 'both') {
                // eslint-disable-next-line no-param-reassign
                acc[key] = val
              }

              return acc
            },
            {},
          )
        }
      })

      state.loading = false
      state.fetched = true
    })
    .addCase(fetchDefaultTokenList.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchDefaultTokenList.rejected, (state) => {
      state.loading = false
    })
    .addCase(
      fetchTokenFromContract.fulfilled,
      (
        state,
        {
          payload: token,
          meta: {
            arg: { address, chainId },
          },
        },
      ) => {
        const loweredAddr = address.toLowerCase()
        if (token) {
          tryInitAddedList(state, chainId)
          state.byChainId[chainId].addedList[loweredAddr] = token
        } else if (state.byChainId[chainId]?.addedList?.[loweredAddr] === null) {
          delete state.byChainId[chainId].addedList[loweredAddr]
        }
      },
    )
    .addCase(
      fetchTokenFromContract.pending,
      (
        state,
        {
          meta: {
            arg: { address, chainId },
          },
        },
      ) => {
        const loweredAddr = address.toLowerCase()
        tryInitAddedList(state, chainId)
        state.byChainId[chainId].addedList[loweredAddr] = null
      },
    )
    .addCase(
      fetchTokenFromContract.rejected,
      (
        state,
        {
          meta: {
            arg: { address, chainId },
          },
        },
      ) => {
        const loweredAddr = address.toLowerCase()
        if (state.byChainId[chainId]?.addedList?.[loweredAddr] === null) {
          delete state.byChainId[chainId].addedList[loweredAddr]
        }
      },
    ),
)
