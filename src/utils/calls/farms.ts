import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import getGasPrice from 'utils/getGasPrice'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const depositLocked = async (masterChefContract, pid, amount, stakeUntil) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  return masterChefContract.depositLocked(pid, value, stakeUntil, { ...options, gasPrice })
}

export const relock = async (masterChefContract, pid, stakeUntil) => {
  const gasPrice = getGasPrice()
  return masterChefContract.relock(pid, stakeUntil, { ...options, gasPrice })
}

export const stakeFarm = async (masterChefContract, pid, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  return masterChefContract.deposit(pid, value, { ...options, gasPrice })
}

export const unstakeFarm = async (masterChefContract, pid, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  return masterChefContract.withdraw(pid, value, { ...options, gasPrice })
}

export const harvestFarm = async (masterChefContract, pid) => {
  const gasPrice = getGasPrice()

  return masterChefContract.withdraw(pid, '0', { ...options, gasPrice })
}
