import { GAS_PRICE_GWEI } from 'sdk'
import { CHAIN_ID } from 'config/constants/networks'
import store from 'state'

/**
 * Function to return gasPrice outwith a react component
 */
const getGasPrice = (): string => {
  const chainId = Number(CHAIN_ID)
  const state = store.getState()
  let selectedGas = state?.user?.gasTypeByChain?.[CHAIN_ID] || 'standard'
  if (selectedGas === 'auto') {
    selectedGas = 'standard'
  }

  const userGas = GAS_PRICE_GWEI?.[chainId]?.[selectedGas] || ''

  return userGas
}

export default getGasPrice
