import { ChainId } from '@pancakeswap/chains'

export default {
  limitless: {
    [ChainId.BSC]: '0xC13CbF50370E5EaE6f5Dd9D8a1015007f34C4eaD'
  },
} as const satisfies Record<string, Record<number, `0x${string}`>>
