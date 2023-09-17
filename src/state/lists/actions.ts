import { Token, ChainId, CG_CHAIN_ID } from 'sdk'
import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { Tags, TokenList, TokenInfo } from '@uniswap/token-lists'
import { ERC20_ABI, ERC20_BYTES32_ABI } from 'config/abi/erc20'
import { getContract } from 'utils'
import { Erc20, Erc20Bytes32 } from 'config/abi/types'
import { arrayify } from '@ethersproject/bytes'
import { parseBytes32String } from '@ethersproject/strings'

/**
 * An empty result, useful as a default.
 */
export const EMPTY_LIST: TokenAddressMap = {}

export interface ExtendedTokenInfo extends TokenInfo {
  readonly render?: 'swap' | 'liquidity' | 'both' | 'hide'
  readonly curepayLink?: string
  readonly vetted?: 'approved' | 'certified'
  readonly shortDescription?: string
  readonly website?: string
  readonly hasTransactonFees?: boolean
  readonly scanLink?: string
  readonly lockedLiquidityLink?: string
  readonly socialLinks?: {
    readonly discord?: string
    readonly telegram?: string
    readonly twitter?: string
    readonly youtube?: string
  }
}

/**
 * Token instances created from token info.
 */
export class WrappedTokenInfo extends Token {
  public readonly tokenInfo: ExtendedTokenInfo

  public readonly tags: TagInfo[]

  constructor(tokenInfo: ExtendedTokenInfo, tags: TagInfo[]) {
    super(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name)
    this.tokenInfo = tokenInfo
    this.tags = tags
  }

  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI
  }
}

type TagDetails = Tags[keyof Tags]

interface TokenListContainer {
  [address: string]: Token
}

export interface TagInfo extends TagDetails {
  id: string
}

export type TokenAddressMap = Readonly<{
  [chainId in ChainId]?: Readonly<{ [tokenAddress: string]: WrappedTokenInfo }>
}>

interface MultichainTokenList extends TokenList {
  readonly tokens: (TokenInfo & {
    readonly chains?: {
      [chainName: string]: {
        chainId: number
        address: string
        scanLink: string
        decimals?: number
      }
    }
  })[]
}

export const getTokenList = (): Promise<MultichainTokenList> => {
  return fetch('https://token-list.poodl.exchange/multichain-tokenlist.json').then((e) => {
    return e.json()
  })
}

export async function getTokenCG(address: string, chainId: ChainId) {
  return fetch(`https://api.coingecko.com/api/v3/coins/${CG_CHAIN_ID[chainId]}/contract/${address}`).then((r) =>
    r.json(),
  )
}

export function listToTokenMap(list: MultichainTokenList): TokenAddressMap {
  const map = list.tokens.reduce<TokenAddressMap>(
    (tokenMap, { chains, ...tokenInfo }) => {
      const tags: TagInfo[] =
        tokenInfo.tags
          ?.map((tagId) => {
            if (!list.tags?.[tagId]) return undefined
            return { ...list.tags[tagId], id: tagId }
          })
          ?.filter((x): x is TagInfo => Boolean(x)) ?? []
      Object.entries(chains).forEach(([, { chainId: tokenChainId, address, scanLink, decimals }]) => {
        if (address && Number(tokenChainId)) {
          const token = new WrappedTokenInfo(
            {
              ...tokenInfo,
              chainId: tokenChainId,
              address,
              scanLink,
              decimals: decimals || tokenInfo.decimals,
            } as ExtendedTokenInfo,
            tags,
          )
          if (!tokenMap[tokenChainId]) {
            tokenMap[tokenChainId] = {}
          }
          const loweredAddr = address.toLowerCase()
          if (!tokenMap[tokenChainId][loweredAddr]) {
            tokenMap[tokenChainId][loweredAddr] = token
          }
        }
      })

      return tokenMap
    },
    { ...EMPTY_LIST },
  )

  let localCustomTokens = null
  const localCustomTokensStr = localStorage.getItem(customTokenStorageKey)
  if (localCustomTokensStr) {
    localCustomTokens = JSON.parse(localCustomTokensStr)
  }
  if (localCustomTokens) {
    Object.entries(localCustomTokens).forEach(([chainIdKey, tokens]) => {
      const chainId = Number(chainIdKey)
      if (!map[chainId]) {
        map[chainId] = {}
      }
      Object.values(tokens).forEach((t) => {
        const loweredAddr = t.address.toLowerCase()
        if (!map[chainId][loweredAddr]) {
          map[chainId][loweredAddr] = new WrappedTokenInfo(t.tokenInfo, [])
        }
      })
    })
  }
  return map
}

export const customTokenStorageKey = 'lnt-customImportedTokens'

export const addCacheToken = createAction<{ cacheToken: WrappedTokenInfo; chainId: ChainId }>('lists/addCacheToken')

// Async thunks
export const fetchDefaultTokenList = createAsyncThunk<TokenAddressMap, void>(
  'lists/updateDefaultList',
  async () => {
    // limitless: use this function to fetch our defualt token from else where... different repo..?
    const tokenList = await getTokenList()
    return listToTokenMap(tokenList)
  },
  {
    condition: (arg, { getState }) => {
      const { lists } = getState() as any
      // no process if already loading
      return !lists.loading
    },
  },
)

const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/

// Async thunks
export const fetchTokenFromContract = createAsyncThunk<Token | undefined, { address: string; chainId: number }>(
  'lists/fetchTokenFromContract',
  ({ address, chainId }) => {
    return getTokenCG(address, chainId)
      .then((res) => {
        const decimals = res?.detail_platforms?.[CG_CHAIN_ID[chainId]]?.decimal_place
        if (!res.symbol || !res.name || !decimals) {
          throw new Error('Invalid token from CG')
        }
        const tokenInfo: ExtendedTokenInfo = {
          chainId,
          address,
          name: res?.name,
          symbol: res?.symbol?.toUpperCase(),
          decimals,
          render: 'swap',
          vetted: null,
          // shortDescription: res?.description?.en,
          website: res?.links?.homepage?.[0],
          logoURI: res?.image?.small,
          // readonly hasTransactonFees?: boolean
          // readonly scanLink?: string
          // readonly lockedLiquidityLink?: string
        }

        return new WrappedTokenInfo(tokenInfo, [])
      })
      .catch(async (ex) => {
        // fallback to use contract to fetch token info
        console.error(ex)

        const tokenContract = getContract(address, ERC20_ABI, undefined, chainId) as Erc20
        const tokenContractBytes32 = getContract(address, ERC20_BYTES32_ABI, undefined, chainId) as Erc20Bytes32
        const decimals = await tokenContract.decimals()
        if (decimals) {
          const handleComplete = ([name, symbol]: [string, string]): Token | undefined => {
            if (name && symbol) {
              return new Token(
                chainId,
                address,
                decimals,
                BYTES32_REGEX.test(symbol) && arrayify(symbol)[31] === 0 ? parseBytes32String(symbol) : symbol,
                BYTES32_REGEX.test(name) && arrayify(name)[31] === 0 ? parseBytes32String(name) : name,
              )
            }
            return undefined
          }
          return Promise.all([tokenContract.name(), tokenContract.symbol()])
            .then(handleComplete)
            .catch(() => {
              return Promise.all([tokenContractBytes32.name(), tokenContractBytes32.symbol()]).then(handleComplete)
            })
        }
        return undefined
      })
  },
  {
    condition: ({ address, chainId }, { getState }) => {
      const { lists } = getState() as any
      // no process if already loading
      return lists.fetched && !lists.loading && lists.byChainId?.[chainId]?.addedList?.[address.toLowerCase()] !== null
    },
  },
)
