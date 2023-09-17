interface ErrorMap {
  in: RegExp | string
  out: string
  from?: ErrorFrom
}

export enum ErrorFrom {
  SWAP = 'Swap',
  LIQUIDITY = 'Liqudity',
}

// Order matters, it will always get the first matching
const errorMap: ErrorMap[] = [
  // Swap error
  {
    in: 'INSUFFICIENT_OUTPUT_AMOUNT',
    out: 'The swap cannot be completed. Please increase your slippage tolerance.',
    from: ErrorFrom.SWAP,
  },
  {
    in: 'EXCESSIVE_INPUT_AMOUNT',
    out: 'The swap cannot be completed. Please increase your slippage tolerance.',
    from: ErrorFrom.SWAP,
  },
  {
    in: /.*: K/g,
    out: 'Something went wrong here. Please decrease the number of decimals in the output, or change the last number in the output to 1.',
    from: ErrorFrom.SWAP,
  },
  {
    in: 'TRANSFER_FAILED',
    out: 'The swap failed. Please increase your slippage tolerance or try to swap a smaller amount.',
    from: ErrorFrom.SWAP,
  },
  {
    in: 'Transaction cannot succeed',
    out: 'There is low liquidity. Please swap a smaller amount.',
    from: ErrorFrom.SWAP,
  },
  {
    in: 'Price impact too High',
    out: 'This swap’s price impact is too high. Try to swap a smaller amount.',
    from: ErrorFrom.SWAP,
  },
  {
    in: 'estimateGas failed',
    out: 'There seems to be an issue with this token. Contact the project’s team to resolve it.',
    from: ErrorFrom.SWAP,
  },
  {
    in: "Cannot read property 'toHexString' of undefined",
    out: 'Something went wrong here. Please decrease the number of decimals in the output, or change the last number in the output to 1.',
    from: ErrorFrom.SWAP,
  },
  {
    in: 'cannot estimate gas: transaction may fail or may require manual gas limit',
    out: 'Something went wrong here. Please decrease the number of decimals in the output, or change the last number in the output to 1.',
    from: ErrorFrom.SWAP,
  },
  {
    in: 'TransferHelper: TRANSFER_FROM_FAILED',
    out: 'The swap failed. Make sure you have enough funds.',
    from: ErrorFrom.SWAP,
  },
  {
    in: 'EXPIRED',
    out: 'This swap has expired. Be sure to confirm your transaction as soon as you create it.',
    from: ErrorFrom.SWAP,
  },
  {
    in: 'Code 105: Increase the slippage',
    out: 'Please increase your slippage tolerance.',
    from: ErrorFrom.SWAP,
  },
  {
    in: 'PancakeSwapFeature/UnderBought',
    out: 'Please increase your slippage tolerance.',
    from: ErrorFrom.SWAP,
  },
  {
    in: 'UnderBought',
    out: 'Please increase your slippage tolerance.',
    from: ErrorFrom.SWAP,
  },
  {
    in: 'UNDERBOUGHT',
    out: 'Please increase your slippage tolerance.',
    from: ErrorFrom.SWAP,
  },
  {
    in: 'underbought',
    out: 'Please increase your slippage tolerance.',
    from: ErrorFrom.SWAP,
  },
  {
    in: 'Code 111: gas estimation failed',
    out: 'Your transaction will most likely fail. If you are swapping a token with fees on transfer, check your slippage or try another output token.',
    from: ErrorFrom.SWAP,
  },
  {
    in: 'Code 105: WalletExecuteDelegateCallFailError',
    out: 'Your transaction will most likely fail. If you are swapping a token with fees on transfer, check your slippage or try another output token.',
    from: ErrorFrom.SWAP,
  },  
  {
    in: 'IncompleteTransformErc20Error',
    out: 'Your transaction will most likely fail. If you are swapping a token with fees on transfer, check your slippage or try another output token.',
    from: ErrorFrom.SWAP,
  },

  // Liquidity error
  {
    in: 'INSUFFICIENT_A_AMOUNT',
    out: 'Please increase your slippage tolerance.',
    from: ErrorFrom.LIQUIDITY,
  },

  {
    in: 'INSUFFICIENT_B_AMOUNT',
    out: 'Please increase your slippage tolerance.',
    from: ErrorFrom.LIQUIDITY,
  },
  {
    in: 'estimateGas failed',
    out: 'Select "receive WBNB". You can unwrap WBNB by swapping them for BNB afterwards.',
    from: ErrorFrom.LIQUIDITY,
  },

  // General Error
  {
    in: 'Provider Error',
    out: 'No browser extensions for a wallet could be found. Please install your wallet’s browser extension.',
  },
  {
    in: 'Unsupported Chain ID',
    out: 'Please switch your wallet to BNB Chain. Check your wallet’s docs for instructions.',
  },
  {
    in: 'Already processing eth_requestAccounts. Please Wait',
    out: 'Make sure you are logged in to your wallet and it is set to BNB Chain.',
  },
  {
    in: 'Internal JSON-RPC error. { "code": -32000, "message": "insufficient funds for transfer" } - Please try again.',
    out: 'Make sure you have enough BNB to cover the gas fees.',
  },
  {
    in: 'MetaMask - RPC Error: Internal JSON-RPC error. estimateGas failed removeLiquidityETHWithPermitSupportingFeeOnTransferTokens estimateGas failed removeLiquidityETHWithPermit',
    out: 'Something went wrong. Try using a wallet different from MetaMask.',
  },
  {
    in: `Error: [ethjs-query] while formatting outputs from RPC '{"value":{"code":-32603,"data":{"code":-32000,"message":"transaction underpriced"}}}`,
    out: 'Please increase the slippage. If you still encounter this error, manually increase the gas limit on your wallet. Refer to your wallet’s docs for instructions.',
  },
  {
    in: `Swap failed: Error: [ethjs-query] while formatting outputs from RPC '{"value":{"code":-32603,"data":{"code":-32603,"message":"handle request error"}}}'`,
    out: 'Please increase the slippage. If you still encounter this error, manually increase the gas limit on your wallet. Refer to your wallet’s docs for instructions.',
  },
]

/**
 * Map ugly error message to a more instructive one
 * @param {string} reason error reason
 * @param {ErrorFrom} from where error from. e.g. swap, liquidity
 */

const cached: { [reason: string]: string } = {}

export default (reason: string, from?: ErrorFrom) => {
  if (reason) {
    const key = `${from}-${reason}`
    if (key in cached) {
      return cached[key]
    }
    const matched = errorMap.find(
      (m) => (!m.from || m.from === from) && (m.in instanceof RegExp ? reason.match(m.in) : reason.includes(m.in)),
    )
    if (matched) {
      cached[key] = matched.out
      return matched.out
    }
  }
  return reason
}
