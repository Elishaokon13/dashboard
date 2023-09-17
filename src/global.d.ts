import type { Ethereum } from '@wagmi/core'

declare global {
  interface Window {
    ethereum?: {
      [x: string]: boolean
      isTokenPocket: boolean
      isMetaMask?: true
      isOpera?: true
      isCoinbaseWallet?: true
      isTrust?: true
      providers?: any[]
      request?: (...args: any[]) => Promise<void>
    }
    bn?: any
    BinanceChain?: {
      bnbSign?: (address: string, message: string) => Promise<{ publicKey: string; signature: string }>
      switchNetwork?: (networkId: string) => Promise<string>
    } & Ethereum
    workbox: any
  }
}
