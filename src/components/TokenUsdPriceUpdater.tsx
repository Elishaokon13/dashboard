import { usePollBNBBusdPrice, usePollLimitlessBusdPrice } from 'hooks/useBUSDPrice'
import useIsMainChain from 'hooks/useIsMainChain'
import React from 'react'

const MainChainUpdater = () => {
  usePollLimitlessBusdPrice()
  usePollBNBBusdPrice()
  return null
}

const TokenUsdPriceUpdater = () => {
  const isMainChain = useIsMainChain()

  return <>{isMainChain && <MainChainUpdater />}</>
}

export default React.memo(TokenUsdPriceUpdater)
