import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import getGasPrice from 'utils/getGasPrice'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const stakeCompound = async (stakeContract) => {
  const gasPrice = getGasPrice()
  return stakeContract.compound( { ...options, gasPrice })
}

export const stakeWithdraw = async (stakeContract, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();
  return stakeContract.withdraw( value, { ...options, gasPrice })
}


export const stakeDeposit = async (stakeContract, amount) => {
  const gasPrice = getGasPrice()
  const value =  new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();
  return stakeContract.deposit( value, { ...options, gasPrice })
}


export const stakeReDeposit = async (stakeContract, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();
  return stakeContract.reDeposit( value, { ...options, gasPrice })
}


