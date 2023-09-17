import { ChainId, GAS_PRICE_GWEI, Pair, Token } from 'sdk'
import { differenceInDays } from 'date-fns'
import flatMap from 'lodash/flatMap'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS } from 'config/constants'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useAllTokens } from 'hooks/Tokens'
import { useFeeData } from 'wagmi'
import { AppDispatch, AppState } from '../../index'
import {
  addSerializedPair,
  addSerializedToken,
  FarmStakedOnly,
  muteAudio,
  removeSerializedToken,
  SerializedPair,
  toggleTheme as toggleThemeAction,
  unmuteAudio,
  updateUserDeadline,
  updateUserExpertMode,
  updateUserFarmStakedOnly,
  updateUserSingleHopOnly,
  updateUserSlippageTolerance,
  updateGasPrice,
  addWatchlistToken,
  addWatchlistPool,
  updateUserPoolStakedOnly,
  updateUserPoolsViewMode,
  ViewMode,
  updateUserFarmsViewMode,
  updateUserPredictionChartDisclaimerShow,
  updateUserPredictionAcceptedRisk,
  updateUserUsernameVisibility,
  updateUserExpertModeAcknowledgementShow,
  hidePhishingWarningBanner,
  setIsExchangeChartDisplayed,
  ChartViewMode,
  setChartViewMode,
  setSubgraphHealthIndicatorDisplayed,
  updateUserSlippageConfirm,
  updateUserLiquidityDevConfirm,
  updateUserUnvettedTokenConfirm,
  setShowAccountDomain,
  togglePinToken,
} from '../actions'
import { deserializeToken, serializeToken } from './helpers'
import BigNumber from 'bignumber.js'
import { useQuery } from '@tanstack/react-query'
import { ALL_GAS_PRICE } from '../../../sdk/multichain'
import { EMPTY_ARRAY } from 'utils/constantObjects'

export function useAudioModeManager(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>()
  const audioPlay = useSelector<AppState, AppState['user']['audioPlay']>((state) => state.user.audioPlay)

  const toggleSetAudioMode = useCallback(() => {
    if (audioPlay) {
      dispatch(muteAudio())
    } else {
      dispatch(unmuteAudio())
    }
  }, [audioPlay, dispatch])

  return [audioPlay, toggleSetAudioMode]
}

export function usePhishingBannerManager(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>()
  const hideTimestampPhishingWarningBanner = useSelector<
    AppState,
    AppState['user']['hideTimestampPhishingWarningBanner']
  >((state) => state.user.hideTimestampPhishingWarningBanner)
  const now = Date.now()
  const showPhishingWarningBanner = hideTimestampPhishingWarningBanner
    ? differenceInDays(now, hideTimestampPhishingWarningBanner) >= 1
    : true
  const hideBanner = useCallback(() => {
    dispatch(hidePhishingWarningBanner())
  }, [dispatch])

  return [showPhishingWarningBanner, hideBanner]
}

// Get user preference for exchange price chart
// For mobile layout chart is hidden by default
export function useExchangeChartManager(isMobile: boolean): [boolean, (isDisplayed: boolean) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const isChartDisplayed = useSelector<AppState, AppState['user']['isExchangeChartDisplayed']>(
    (state) => state.user.isExchangeChartDisplayed,
  )

  const setUserChartPreference = useCallback(
    (isDisplayed: boolean) => {
      dispatch(setIsExchangeChartDisplayed(isDisplayed))
    },
    [dispatch],
  )

  return [isMobile ? false : isChartDisplayed, setUserChartPreference]
}

export function useExchangeChartViewManager() {
  const dispatch = useDispatch<AppDispatch>()
  const chartViewMode = useSelector<AppState, AppState['user']['userChartViewMode']>(
    (state) => state.user.userChartViewMode,
  )

  const setUserChartViewPreference = useCallback(
    (view: ChartViewMode) => {
      dispatch(setChartViewMode(view))
    },
    [dispatch],
  )

  return [chartViewMode, setUserChartViewPreference] as const
}

export function useSubgraphHealthIndicatorManager() {
  const dispatch = useDispatch<AppDispatch>()
  const isSubgraphHealthIndicatorDisplayed = useSelector<
    AppState,
    AppState['user']['isSubgraphHealthIndicatorDisplayed']
  >((state) => state.user.isSubgraphHealthIndicatorDisplayed)

  const setSubgraphHealthIndicatorDisplayedPreference = useCallback(
    (newIsDisplayed: boolean) => {
      dispatch(setSubgraphHealthIndicatorDisplayed(newIsDisplayed))
    },
    [dispatch],
  )

  return [isSubgraphHealthIndicatorDisplayed, setSubgraphHealthIndicatorDisplayedPreference] as const
}

export function useIsExpertMode(): boolean {
  return useSelector<AppState, AppState['user']['userExpertMode']>((state) => state.user.userExpertMode)
}

export function useExpertModeManager(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>()
  const expertMode = useIsExpertMode()

  const toggleSetExpertMode = useCallback(() => {
    dispatch(updateUserExpertMode({ userExpertMode: !expertMode }))
  }, [expertMode, dispatch])

  return [expertMode, toggleSetExpertMode]
}

export function useThemeManager(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>()
  const isDark = useSelector<AppState, AppState['user']['isDark']>((state) => state.user.isDark)

  const toggleTheme = useCallback(() => {
    dispatch(toggleThemeAction())
  }, [dispatch])

  return [isDark, toggleTheme]
}

export function useUserSingleHopOnly(): [boolean, (newSingleHopOnly: boolean) => void] {
  const dispatch = useDispatch<AppDispatch>()

  const singleHopOnly = useSelector<AppState, AppState['user']['userSingleHopOnly']>(
    (state) => state.user.userSingleHopOnly,
  )

  const setSingleHopOnly = useCallback(
    (newSingleHopOnly: boolean) => {
      dispatch(updateUserSingleHopOnly({ userSingleHopOnly: newSingleHopOnly }))
    },
    [dispatch],
  )

  return [singleHopOnly, setSingleHopOnly]
}

export function useUserSlippageConfirm(): [boolean, (slippageConfirm: boolean) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userSlippageConfirm = useSelector<AppState, AppState['user']['userSlippageConfirm']>((state) => {
    return state.user.userSlippageConfirm
  })

  const setUserSlippageConfirm = useCallback(
    (slippageConfirm: boolean) => {
      dispatch(updateUserSlippageConfirm({ userSlippageConfirm: slippageConfirm }))
    },
    [dispatch],
  )

  return [userSlippageConfirm, setUserSlippageConfirm]
}

export function useUserUnvettedTokenConfirm(): [boolean, (unvettedTokenConfirm: boolean) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userUnvettedTokenConfirm = useSelector<AppState, AppState['user']['userUnvettedTokenConfirm']>((state) => {
    return state.user.userUnvettedTokenConfirm
  })
  const setUserUnvettedTokenConfirm = useCallback(
    (unvettedTokenConfirm: boolean) => {
      dispatch(updateUserUnvettedTokenConfirm({ userUnvettedTokenConfirm: unvettedTokenConfirm }))
    },
    [dispatch],
  )

  return [userUnvettedTokenConfirm, setUserUnvettedTokenConfirm]
}

export function useLiquidityDevConfirm(): [boolean, (LiquidityDevConfirm: boolean) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userLiquidityDevConfirm = useSelector<AppState, AppState['user']['userLiquidityDevConfirm']>((state) => {
    return state.user.userLiquidityDevConfirm
  })

  const setUserLiquidityDevConfirm = useCallback(
    (LiquidityDevConfirm: boolean) => {
      dispatch(updateUserLiquidityDevConfirm({ userLiquidityDevConfirm: LiquidityDevConfirm }))
    },
    [dispatch],
  )

  return [userLiquidityDevConfirm, setUserLiquidityDevConfirm]
}

export function useUserSlippageTolerance(): [number, (slippage: number) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userSlippageTolerance = useSelector<AppState, AppState['user']['userSlippageTolerance']>((state) => {
    // Limitless: force + 3% to user set slippage.
    // There are lots of consumers, so set it in here can avoid accidentally missing certain place.
    return state.user.userSlippageTolerance // + 300 // 1% slippage = 100
  })

  const setUserSlippageTolerance = useCallback(
    (slippage: number) => {
      dispatch(updateUserSlippageTolerance({ userSlippageTolerance: slippage }))
    },
    [dispatch],
  )

  return [userSlippageTolerance, setUserSlippageTolerance]
}

export function useUserFarmStakedOnly(): [boolean, (stakedOnly: boolean) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userFarmStakedOnly = useSelector<AppState, AppState['user']['userFarmStakedOnly']>((state) => {
    return state.user.userFarmStakedOnly
  })

  const setUserFarmStakedOnly = useCallback(
    (stakedOnly: boolean) => {
      const farmStakedOnly = stakedOnly ? FarmStakedOnly.TRUE : FarmStakedOnly.FALSE
      dispatch(updateUserFarmStakedOnly({ userFarmStakedOnly: farmStakedOnly }))
    },
    [dispatch],
  )

  return [userFarmStakedOnly === FarmStakedOnly.TRUE, setUserFarmStakedOnly]
}

export function useUserPoolStakedOnly(): [boolean, (stakedOnly: boolean) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userPoolStakedOnly = useSelector<AppState, AppState['user']['userPoolStakedOnly']>((state) => {
    return state.user.userPoolStakedOnly
  })

  const setUserPoolStakedOnly = useCallback(
    (stakedOnly: boolean) => {
      dispatch(updateUserPoolStakedOnly({ userPoolStakedOnly: stakedOnly }))
    },
    [dispatch],
  )

  return [userPoolStakedOnly, setUserPoolStakedOnly]
}

export function useUserPoolsViewMode(): [ViewMode, (viewMode: ViewMode) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userPoolsViewMode = useSelector<AppState, AppState['user']['userPoolsViewMode']>((state) => {
    return state.user.userPoolsViewMode
  })

  const setUserPoolsViewMode = useCallback(
    (viewMode: ViewMode) => {
      dispatch(updateUserPoolsViewMode({ userPoolsViewMode: viewMode }))
    },
    [dispatch],
  )

  return [userPoolsViewMode, setUserPoolsViewMode]
}

export function useUserFarmsViewMode(): [ViewMode, (viewMode: ViewMode) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userFarmsViewMode = useSelector<AppState, AppState['user']['userFarmsViewMode']>((state) => {
    return state.user.userFarmsViewMode
  })

  const setUserFarmsViewMode = useCallback(
    (viewMode: ViewMode) => {
      dispatch(updateUserFarmsViewMode({ userFarmsViewMode: viewMode }))
    },
    [dispatch],
  )

  return [userFarmsViewMode, setUserFarmsViewMode]
}

export function useUserPredictionAcceptedRisk(): [boolean, (acceptedRisk: boolean) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userPredictionAcceptedRisk = useSelector<AppState, AppState['user']['userPredictionAcceptedRisk']>((state) => {
    return state.user.userPredictionAcceptedRisk
  })

  const setUserPredictionAcceptedRisk = useCallback(
    (acceptedRisk: boolean) => {
      dispatch(updateUserPredictionAcceptedRisk({ userAcceptedRisk: acceptedRisk }))
    },
    [dispatch],
  )

  return [userPredictionAcceptedRisk, setUserPredictionAcceptedRisk]
}

export function useUserPredictionChartDisclaimerShow(): [boolean, (showDisclaimer: boolean) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userPredictionChartDisclaimerShow = useSelector<
    AppState,
    AppState['user']['userPredictionChartDisclaimerShow']
  >((state) => {
    return state.user.userPredictionChartDisclaimerShow
  })

  const setPredictionUserChartDisclaimerShow = useCallback(
    (showDisclaimer: boolean) => {
      dispatch(updateUserPredictionChartDisclaimerShow({ userShowDisclaimer: showDisclaimer }))
    },
    [dispatch],
  )

  return [userPredictionChartDisclaimerShow, setPredictionUserChartDisclaimerShow]
}

export function useUserExpertModeAcknowledgementShow(): [boolean, (showAcknowledgement: boolean) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userExpertModeAcknowledgementShow = useSelector<
    AppState,
    AppState['user']['userExpertModeAcknowledgementShow']
  >((state) => {
    return state.user.userExpertModeAcknowledgementShow
  })

  const setUserExpertModeAcknowledgementShow = useCallback(
    (showAcknowledgement: boolean) => {
      dispatch(updateUserExpertModeAcknowledgementShow({ userExpertModeAcknowledgementShow: showAcknowledgement }))
    },
    [dispatch],
  )

  return [userExpertModeAcknowledgementShow, setUserExpertModeAcknowledgementShow]
}

export function useUserUsernameVisibility(): [boolean, (usernameVisibility: boolean) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userUsernameVisibility = useSelector<AppState, AppState['user']['userUsernameVisibility']>((state) => {
    return state.user.userUsernameVisibility
  })

  const setUserUsernameVisibility = useCallback(
    (usernameVisibility: boolean) => {
      dispatch(updateUserUsernameVisibility({ userUsernameVisibility: usernameVisibility }))
    },
    [dispatch],
  )

  return [userUsernameVisibility, setUserUsernameVisibility]
}

// checkout useTransactionDeadline.ts for real use. This one is only use to set.
export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userDeadline = useSelector<AppState, AppState['user']['userDeadline']>((state) => {
    return state.user.userDeadline
  })

  const setUserDeadline = useCallback(
    (deadline: number) => {
      dispatch(updateUserDeadline({ userDeadline: deadline }))
    },
    [dispatch],
  )

  return [userDeadline, setUserDeadline]
}

export function useAddUserToken(): (token: Token) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (token: Token) => {
      dispatch(addSerializedToken({ serializedToken: serializeToken(token) }))
    },
    [dispatch],
  )
}

export function useRemoveUserAddedToken(): (chainId: number, address: string) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (chainId: number, address: string) => {
      dispatch(removeSerializedToken({ chainId, address }))
    },
    [dispatch],
  )
}

export function useGasPrice(): string {
  const gases = useAllGasPrices()
  const [selectedGas] = useGasPriceManager()
  return gases?.gas?.[selectedGas] || gases?.gas?.standard || '0'
}

export function useAllGasPrices(): {
  gas: {
    standard: string
    fast: string
    lightspeed: string
  }
  gwei: {
    standard: string
    fast: string
    lightspeed: string
  }
} {
  const { chainId, provider } = useActiveWeb3React()
  const { data: gas } = useQuery(
    ['gasPrice', chainId],
    () =>
      provider.getGasPrice().then((e) => {
        const gasPrice = new BigNumber(e._hex)
        const standard = gasPrice.integerValue()
        const fast = standard.times(1.05).integerValue()
        const lightspeed = fast.times(1.1).integerValue()
        return {
          gas: {
            standard: standard.toString(),
            fast: fast.toString(),
            lightspeed: lightspeed.toString(),
          },
          gwei: {
            standard: standard
              .div(10 ** 9)
              .decimalPlaces(2)
              .toString(),
            fast: fast
              .div(10 ** 9)
              .decimalPlaces(2)
              .toString(),
            lightspeed: lightspeed
              .div(10 ** 9)
              .decimalPlaces(2)
              .toString(),
          },
        }
      }),
    {
      enabled: Boolean(chainId && !ALL_GAS_PRICE[chainId]),
      refetchOnMount: false,
      refetchOnWindowFocus: true,
      refetchInterval: chainId === ChainId.BSC ? 0 : 1000 * 5, // refetch every 5s
    },
  )
  return ALL_GAS_PRICE[chainId] || gas
}

export function useGasPriceManager(): [string, (userGasPrice: string) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const { chainId } = useActiveWeb3React()
  const selectedGas = useSelector<AppState, AppState['user']['gasTypeByChain'][ChainId]>((state) =>
    chainId ? state.user.gasTypeByChain?.[chainId] : '',
  )
  const setGasPrice = useCallback(
    (gasType: string) => {
      dispatch(updateGasPrice({ gasType, chainId }))
    },
    [dispatch, chainId],
  )

  let sg = 'standard'

  if (selectedGas === 'lightspeed' || selectedGas === 'fast') {
    sg = selectedGas
  }
  return [sg, setGasPrice]
}

function serializePair(pair: Pair): SerializedPair {
  return {
    token0: serializeToken(pair.token0),
    token1: serializeToken(pair.token1),
  }
}

export function usePairAdder(): (pair: Pair) => void {
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(
    (pair: Pair) => {
      dispatch(addSerializedPair({ serializedPair: serializePair(pair) }))
    },
    [dispatch],
  )
}

/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
export function useTrackedTokenPairs(): [Token, Token][] {
  const { chainId } = useActiveWeb3React()
  const tokens = useAllTokens()

  // pinned pairs
  const pinnedPairs = useMemo(() => (chainId ? PINNED_PAIRS[chainId] ?? [] : []), [chainId])

  // pairs for every token against every base
  const generatedPairs: [Token, Token][] = useMemo(
    () =>
      chainId
        ? flatMap(Object.keys(tokens), (tokenAddress) => {
            const token = tokens[tokenAddress]
            // for each token on the current chain,
            return (
              // loop though all bases on the current chain
              (BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
                // to construct pairs of the given token with each base
                .map((base) => {
                  if (base.address === token.address) {
                    return null
                  }
                  return [base, token]
                })
                .filter((p): p is [Token, Token] => p !== null)
            )
          })
        : [],
    [tokens, chainId],
  )

  // pairs saved by users
  const savedSerializedPairs = useSelector<AppState, AppState['user']['pairs']>(({ user: { pairs } }) => pairs)

  const userPairs: [Token, Token][] = useMemo(() => {
    if (!chainId || !savedSerializedPairs) return []
    const forChain = savedSerializedPairs[chainId]
    if (!forChain) return []

    return Object.keys(forChain).map((pairId) => {
      return [deserializeToken(forChain[pairId].token0), deserializeToken(forChain[pairId].token1)]
    })
  }, [savedSerializedPairs, chainId])

  const combinedList = useMemo(
    () => userPairs.concat(generatedPairs).concat(pinnedPairs),
    [generatedPairs, pinnedPairs, userPairs],
  )

  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = combinedList.reduce<{ [key: string]: [Token, Token] }>((memo, [tokenA, tokenB]) => {
      const sorted = tokenA.sortsBefore(tokenB)
      const key = sorted ? `${tokenA.address}:${tokenB.address}` : `${tokenB.address}:${tokenA.address}`
      if (memo[key]) return memo
      memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA]
      return memo
    }, {})

    return Object.keys(keyed).map((key) => keyed[key])
  }, [combinedList])
}

export const useWatchlistTokens = (): [string[], (address: string) => void] => {
  const dispatch = useDispatch<AppDispatch>()
  const savedTokens = useSelector((state: AppState) => state.user.watchlistTokens) ?? []
  const updatedSavedTokens = useCallback(
    (address: string) => {
      dispatch(addWatchlistToken({ address }))
    },
    [dispatch],
  )
  return [savedTokens, updatedSavedTokens]
}

export const useWatchlistPools = (): [string[], (address: string) => void] => {
  const dispatch = useDispatch<AppDispatch>()
  const savedPools = useSelector((state: AppState) => state.user.watchlistPools) ?? []
  const updateSavedPools = useCallback(
    (address: string) => {
      dispatch(addWatchlistPool({ address }))
    },
    [dispatch],
  )
  return [savedPools, updateSavedPools]
}

export const useShowAccountDomain = (): [boolean, (showAccountDomain: boolean) => void] => {
  const dispatch = useDispatch<AppDispatch>()
  const showAccountDomain = useSelector((state: AppState) => state.user.showAccountDomain)
  const toggleShowAccountDomain = useCallback(
    (val: boolean) => {
      dispatch(setShowAccountDomain(val))
    },
    [dispatch],
  )
  return [showAccountDomain, toggleShowAccountDomain]
}

const permPinnedTokens = new Set<string>([
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  '0xb7486718ea21c79bbd894126f79f504fd3625f68', // PET
  '0x4a68c250486a116dc8d6a0c5b0677de07cc09c5d', // POODL
])

export const usePinnedTokens = (): [string[], string[]] => {
  const { chainId } = useActiveWeb3React()
  const pinnedTokens: string[] = useSelector(
    (state: AppState) => (chainId && state.user?.pinnedTokens?.[chainId]) || EMPTY_ARRAY,
  )

  const mappedPinnedToken = useMemo(() => {
    const mapped = ['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee']

    if (chainId === ChainId.Polygon) {
      mapped.push('0xb7486718ea21c79bbd894126f79f504fd3625f68')
    } else if (chainId === ChainId.BSC) {
      mapped.push('0x4a68c250486a116dc8d6a0c5b0677de07cc09c5d')
    }

    return Array.from(new Set(mapped.concat(pinnedTokens)))
  }, [pinnedTokens, chainId])

  return [mappedPinnedToken, pinnedTokens]
}

export const isPermPinToken = (address: string): boolean => permPinnedTokens.has(address.toLowerCase())

export const useIsPinned = (
  chainId: ChainId,
  address: string,
): [boolean, (chainId: number, address: string) => void] => {
  const loweredAddress = address?.toLowerCase()

  const dispatch = useDispatch<AppDispatch>()
  const isPinned = useSelector(
    (state: AppState) => (chainId && state.user?.pinnedTokens?.[chainId]?.includes(loweredAddress)) || false,
  )

  const togglePinToggle = useCallback(() => {
    dispatch(togglePinToken({ chainId, address: loweredAddress }))
  }, [dispatch, chainId, loweredAddress])

  if (!chainId || !address || isPermPinToken(loweredAddress)) {
    return [false, null]
  }

  return [isPinned, togglePinToggle]
}
