import { BinanceWalletConnector } from 'wagmiUtil/connectors/binanceWallet'
import { configureChains, createConfig } from 'wagmi'
import memoize from 'lodash/memoize'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { bsc } from 'wagmi/chains'
import { EthereumClient, w3mConnectors } from '@web3modal/ethereum'
import { CHAINS } from 'sdk'

export const w3mProjectId = '52e491afe8eff72f1ffb2ba1b810613e'

const { chains, publicClient } = configureChains(
  [bsc],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: process.env.NEXT_PUBLIC_NODE_PRODUCTION,
      }),
    }),
  ],
)

/*
export const injectedConnector = new InjectedConnector({
  chains,
  options: {
    shimDisconnect: false,
  },
})

export const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    projectId: w3mProjectId,
    showQrModal: true,
    isNewChainsStale: false,
  },
})

export const metaMaskConnector = new MetaMaskConnector({
  chains,
  options: {
    shimDisconnect: false,
  },
})

export const coinbaseConnector = new CoinbaseWalletConnector({
  chains,
  options: {
    appName: 'Limitless Network',
    appLogoUrl: 'https://app.limitlessnetwork.org/favicon.ico',
  },
})

export const bscConnector = new BinanceWalletConnector({ chains })
*/

export const wagmiConfig = createConfig({
  autoConnect: false,
  publicClient,
  connectors: w3mConnectors({ chains, projectId: '52e491afe8eff72f1ffb2ba1b810613e' }),
})

export const ethereumClient = new EthereumClient(wagmiConfig, chains)

export const CHAIN_IDS = chains.map((c) => c.id)
export const isChainSupported = memoize((chainId: number) => CHAIN_IDS.includes(chainId))