import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { persistReducer, persistStore } from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'
import blockReducer from './block'
import { updateVersion } from './global/actions'
import infoReducer from './info'
import lists from './lists/reducer'
import multicall from './multicall/reducer'
import swap from './swap/reducer'
import transactions from './transactions/reducer'
import user from './user/reducer'
import global from './global'

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null)
    },
    setItem(_key, value) {
      return Promise.resolve(value)
    },
    removeItem(_key) {
      return Promise.resolve()
    },
  }
}

// a fix for server error redux-persist failed to create sync storage. falling back to noop storage.
// steal from https://github.com/vercel/next.js/discussions/15687
const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage()

const PERSISTED_KEYS: string[] = ['user', 'transactions'] // no need to persist list because our list is always defaulted

const persistConfig = {
  key: 'primary',
  whitelist: PERSISTED_KEYS,
  storage,
}

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    block: blockReducer, // todo: is this useful?
    // pools: poolsReducer,
    // predictions: predictionsReducer,
    // profile: profileReducer,
    // lottery: lotteryReducer,
    info: infoReducer,
    global,
    // nftMarket: nftMarketReducer,

    // Exchange
    user,
    transactions,
    swap,
    multicall, // contract calls?
    lists, // token lists
  }),
)

// eslint-disable-next-line import/no-mutable-exports
let store: ReturnType<typeof makeStore>
function makeStore(preloadedState = undefined) {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: false,
      }),
    devTools: process.env.NODE_ENV === 'development',
    preloadedState,
  })
}

export const initializeStore = (preloadedState = undefined) => {
  let _store = store ?? makeStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store

  // Create the store once in the client
  if (!store) {
    store = _store
    store.dispatch(updateVersion())
  }

  return _store
}

store = initializeStore()

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export const useAppDispatch: () => AppDispatch = () => useDispatch()

export default store

export const persistor = persistStore(store)

export function useStore(initialState) {
  return useMemo(() => initializeStore(initialState), [initialState])
}
