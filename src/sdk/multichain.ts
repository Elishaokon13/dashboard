import * as wagmiChains from 'wagmi/chains'
import { Chain } from 'wagmi'
import { ChainIdMap } from 'sdk/constants'
import { Token } from 'sdk/entities/token'
import { Currency } from 'sdk/entities/currency'
import { ChainId } from './constants'
import { parseUnits } from '@ethersproject/units'
import { getContractAddressesForChainOrThrow } from '@poodl/contract-addresses'

/**
 * wagmiChains contains partial specs for the following chains
 *
 * mainnet, ropsten, rinkeby, goerli, kovan, sepolia, optimism, optimismKovan, optimismGoerli,
 * polygon, polygonMumbai, arbitrum, arbitrumRinkeby, arbitrumGoerli, localhost, hardhat, foundr,
 *
 * If existed in wagmiChains. You can {...wagmiChains.[chainName]} to import some of the chain specs,
 */
export interface ExtendedChain extends Chain {
  shortName: string

  /**
   * coin geico chain id. https://www.coingecko.com/en/api/documentation
   */
  cgChainId: string

  /**
   * Chain logo url, obtain from https://coinmarketcap.com/chain-ranking/
   */
  chainLogoUrl: string
  wrappedTokenAddress: string

  /**
   * For USD price. Contract address obtain from https://github.com/1inch/spot-price-aggregator
   */
  offChainOracleAddress: string // for price
  aggregator: {
    apiUrl: string
    proxyAddress: string
  }
  gasPriceGWEI?: Record<string, string>

  /**
   * Need at least two stable coins
   */
  stablecoins: {
    address: string
    decimals: number
    symbol: string
  }[]
  analyticUrl: string
  analyticBlockUrl: string

  /**
   * Optional, will be remove in the future
   */
  dexSource?: {
    routerAddress: string
    factoryAddress: string
    initCodeHash: string
  }

  color: string
}

/**
 * Using the follow format to OVERRIDE default RPC NODE
 * ```
 * rpcUrls: {
 *  default: {
 *    http:['url']
 *  },
 *  public: {
 *    http:['url']
 *  }
 *}
 * ```
 */


export const bsc: ExtendedChain = {
  ...wagmiChains.bsc,
  color: '#F0B90B',
  chainLogoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  cgChainId: 'binance-smart-chain',
  gasPriceGWEI: {
    standard: '5',
    fast: '6',
    lightspeed: '10',
  },
  offChainOracleAddress: '0xfbD61B037C325b959c0F6A7e69D8f37770C2c550',
  name: 'BNB Chain',
  shortName: 'BSC',
  wrappedTokenAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  aggregator: {
    apiUrl: process.env.NEXT_PUBLIC_BSC_AGGREGATOR_API || 'https://bsc.api-poodl-exchange.com',
    proxyAddress: getContractAddressesForChainOrThrow(ChainId.BSC as number).exchangeProxy,
  },
  analyticUrl: 'https://api.thegraph.com/subgraphs/name/limitless-team/exchange',
  analyticBlockUrl: 'https://api.thegraph.com/subgraphs/name/limitless-team/blocks',
  dexSource: {
    factoryAddress: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    initCodeHash: '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
    routerAddress: '0x5d45533683F60B05FE9EB04898B8f874FE7484Ec',
  },
  stablecoins: [
    {
      address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      decimals: 18,
      symbol: 'BUSD',
    },
    {
      address: '0x55d398326f99059fF775485246999027B3197955',
      decimals: 18,
      symbol: 'USDT',
    },
  ],
}

/**
 * -------- MAPPING ---------
 */

// add chains here
export const CHAINS: ExtendedChain[] = [bsc]

export const CHAINS_MAP: ChainIdMap<ExtendedChain> = CHAINS.reduce((acc, chain) => {
  acc[chain.id] = chain
  return acc
}, {})

export const ETHER: ChainIdMap<Currency> = CHAINS.reduce(
  (acc, chain) => {
    acc[chain.id] = new Currency(
      chain.nativeCurrency.decimals,
      chain.nativeCurrency.symbol,
      chain.nativeCurrency.symbol,
      chain.id,
      '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    )
    return acc
  },
  { [undefined as any]: new Currency(18, 'TTT', 'TTT', ChainId.BSC, '') },
)

export const WETH: ChainIdMap<Token> = CHAINS.reduce((acc, chain) => {
  acc[chain.id] = new Token(
    chain.id,
    chain.wrappedTokenAddress,
    chain.nativeCurrency.decimals,
    `W${chain.nativeCurrency.symbol}`,
    `Wrapped ${chain.nativeCurrency.symbol}`,
  )
  return acc
}, {})

export const STABLE_TOKENS: ChainIdMap<Token> = CHAINS.reduce((acc, chain) => {
  acc[chain.id] = chain.stablecoins.map(
    (token) => new Token(chain.id, token.address, token.decimals, token.symbol, token.symbol),
  )
  return acc
}, {})

export const ALL_GAS_PRICE: ChainIdMap<string> = CHAINS.reduce((acc, chain) => {
  if (chain.gasPriceGWEI) {
    acc[chain.id] = {
      gas: {
        standard: parseUnits(chain.gasPriceGWEI.standard, 'gwei').toString(),
        fast: parseUnits(chain.gasPriceGWEI.fast, 'gwei').toString(),
        lightspeed: parseUnits(chain.gasPriceGWEI.lightspeed, 'gwei').toString(),
      },
      gwei: {
        standard: chain.gasPriceGWEI.standard,
        fast: chain.gasPriceGWEI.fast,
        lightspeed: chain.gasPriceGWEI.lightspeed,
      },
    }
  }
  return acc
}, {})

export const GAS_PRICE_GWEI: ChainIdMap<string> = CHAINS.reduce((acc, chain) => {
  if (chain.gasPriceGWEI) {
    acc[chain.id] = Object.entries(chain.gasPriceGWEI).reduce((g, [key, val]) => {
      g[key] = parseUnits(val, 'gwei').toString()
      return g
    }, {})
  }
  return acc
}, {})

export const GAS_PRICE: ChainIdMap<string> = CHAINS.reduce((acc, chain) => {
  if (chain.gasPriceGWEI) {
    acc[chain.id] = chain.gasPriceGWEI
  }
  return acc
}, {})

export const OFF_CHAIN_ORACLE_ADDRESS: ChainIdMap<string> = CHAINS.reduce((acc, chain) => {
  acc[chain.id] = chain.offChainOracleAddress
  return acc
}, {})

export const ROUTER_ADDRESS: ChainIdMap<string> = CHAINS.reduce((acc, chain) => {
  if (chain.dexSource) acc[chain.id] = chain.dexSource.routerAddress
  return acc
}, {})

export const AGGREGATOR_PROXY_ADDRESS: ChainIdMap<string> = CHAINS.reduce((acc, chain) => {
  acc[chain.id] = chain.aggregator.proxyAddress
  return acc
}, {})

export const INIT_CODE_HASH_MAP: ChainIdMap<string> = CHAINS.reduce((acc, chain) => {
  if (chain.dexSource) acc[chain.id] = chain.dexSource.initCodeHash
  return acc
}, {})
export const FACTORY_ADDRESS_MAP: ChainIdMap<string> = CHAINS.reduce((acc, chain) => {
  if (chain.dexSource) acc[chain.id] = chain.dexSource.factoryAddress
  return acc
}, {})

export const BASE_BSC_SCAN_URLS: ChainIdMap<string> = CHAINS.reduce((acc, chain) => {
  acc[chain.id] = chain.blockExplorers?.default?.url
  return acc
}, {})

export const CG_CHAIN_ID: ChainIdMap<string> = CHAINS.reduce((acc, chain) => {
  acc[chain.id] = chain.cgChainId
  return acc
}, {})

export const ANALYTIC_URL: ChainIdMap<string> = CHAINS.reduce((acc, chain) => {
  acc[chain.id] = chain.analyticUrl
  return acc
}, {})
export const ANALYTIC_BLOCK_URL: ChainIdMap<string> = CHAINS.reduce((acc, chain) => {
  acc[chain.id] = chain.analyticBlockUrl
  return acc
}, {})
