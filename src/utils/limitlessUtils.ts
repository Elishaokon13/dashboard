import { formatEther } from '@ethersproject/units'
import { BigNumber } from '@ethersproject/bignumber'
import SingletonRouter from 'next/router'

const dividendRate = 0.001
const totalTokens = 93687322 //https://polygonscan.com/token/0x61b15b70c31e2a6e9716ba66937bc3febc4b2b17

export const replaceQueryParam = (query: any, replaceAll = false) => {
  if (!replaceAll) {
    const parsedQs = new URLSearchParams(window.location.search)
    parsedQs.forEach((val, key) => {
      if (!query[key]) {
        query[key] = val
      }
    })
  }
  SingletonRouter.replace({ pathname: SingletonRouter.pathname, query }, undefined, { shallow: true })
}

export const calculateDailyDividends = (bagSize: number, dailyVolume: number): number => {
  const percentageOwed = bagSize / totalTokens
  const totalDividendsToBePaid = dividendRate * dailyVolume
  const dailyDividends = totalDividendsToBePaid * percentageOwed

  return dailyDividends
}

export const toThousandSeparated = (str: string) => {
  return Number(str)?.toLocaleString('en-US', { maximumFractionDigits: 18 })
}

export const stringToFixed = (balance: string, decimalPlaces: number) => {
  if (!balance) {
    return balance
  }

  const balanceValue = parseFloat(balance)
  const fixedBalance = balanceValue.toFixed(decimalPlaces)
  if (balanceValue && !Number(fixedBalance)) {
    if (decimalPlaces === 0) {
      return '<1'
    }
    return `<${(0).toFixed(decimalPlaces - 1)}1`
  }
  const localeBalance = parseFloat(fixedBalance).toLocaleString('en-US', {
    minimumFractionDigits: decimalPlaces, // TODO: fetch locale
    maximumFractionDigits: decimalPlaces,
  })

  return localeBalance
}

export const formatDollars = (dollars: number) => {
  const decimalPlaces = 2
  const formattedDollars = stringToFixed(String(dollars), decimalPlaces)
  return formattedDollars
}

/**
 * Copy a string to clipboard
 * @param  {String} text         The string to be copied to clipboard
 * @return {Boolean}               returns a boolean correspondent to the success of the copy operation.
 * @see https://stackoverflow.com/a/53951634/938822
 */
export const copyToClipboard = (text: string) => {
  let textarea
  let result

  try {
    textarea = document.createElement('textarea')
    textarea.setAttribute('readonly', 'true')
    textarea.setAttribute('contenteditable', 'true')
    textarea.style.position = 'fixed' // prevent scroll from jumping to the bottom when focus is set.
    textarea.value = text

    document.body.appendChild(textarea)

    textarea.focus()
    textarea.select()

    const range = document.createRange()
    range.selectNodeContents(textarea)

    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)

    textarea.setSelectionRange(0, textarea.value.length)
    result = document.execCommand('copy')
  } catch (err) {
    console.error(err)
    result = null
  } finally {
    if (textarea) document.body.removeChild(textarea)
  }

  // manual copy fallback using prompt
  if (!result) {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const copyHotkey = isMac ? '⌘C' : 'CTRL+C'
    result = prompt(`Press ${copyHotkey}`, text) // eslint-disable-line no-alert
    if (!result) {
      return false
    }
  }
  return true
}

export const formatHex = (hex: any): string => formatEther(BigNumber.from(hex).toString())

export const canCollect = (fixed: string): boolean => {
  if (fixed) {
    const t = Number(fixed.replaceAll(',', ''))
    return t > 0
  }

  return false
}
