import { ChainId } from '@pancakeswap/chains'

export const PUBLIC_NODES = {
  [ChainId.BSC]: [
    process.env.NEXT_PUBLIC_NODE_PRODUCTION,
  ].filter(Boolean)
}
