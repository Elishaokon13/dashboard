import { Colors } from './types'

export const baseColors = {
  failure: '#d32f2f',
  primary: '#2196f3',
  primaryBright: '#2196f3',
  primaryDark: '',
  secondary: '#FFFFFF',
  secondaryBright: '#FFFFFF',
  secondaryDark: '#131313 ',
  success: '#2196f3',
  warning: '#f7931E',
  lntGradient: 'linear-gradient(179deg,#2196f3 0%,#F1644C 50%,#E7337A 100%)',
  lntGradientText: 'linear-gradient(to bottom,#2196f3 35%,#F1644C 70%,#E7337A 80%);',
  limitlessBlue: '#2196f3'
}

export const additionalColors = {
  binance: '#F0B90B',
  overlay: '#f8a84b',
  gold: '#FFC700',
  silver: '#B2B2B2',
  bronze: '#E7974D',
}

const sharedGrad = {
  limitlessHome: '#00081a',
  limitlessGrad: '#00081a',
  limitlessGrad2: '#00081a',
  limitlessGrad3: '#00081a',
  limitlessGrad4: '#00081a',
}

export const lightColors: Colors = {
  ...baseColors,
  ...additionalColors,
  background: '#FFFFFF',
  backgroundDisabled: '#E9EAEB',
  backgroundAlt: '#FFFFFF',
  backgroundAlt2: '#E6EBF0',
  cardBorder: '#00000',
  contrast: '#2e2c27',
  dropdown: '#F6F6F6',
  dropdownDeep: '#EEEEEE',
  invertedContrast: '#FFFFFF',
  input: '#FFFFFF',
  inputSecondary: '#c4c4c4',
  tertiary: '#EFF4F5',
  text: '#131313',
  textSecondary: '#6a757e',
  textDisabled: '#BDC2C4',
  textSubtle: '#131313',
  disabled: '#E9EAEB',
  gradients: {
    bubblegum: 'linear-gradient(139.73deg, #E5FDFF 0%, #F3EFFF 100%)',
    inverseBubblegum: 'linear-gradient(139.73deg, #F3EFFF 0%, #E5FDFF 100%)',
    cardHeader: 'linear-gradient(111.68deg, #F2ECF2 0%, #E8F2F6 100%)',
    blue: 'linear-gradient(180deg, #A7E8F1 0%, #94E1F2 100%)',
    violet: 'linear-gradient(180deg, #E2C9FB 0%, #CDB8FA 100%)',
    violetAlt: 'linear-gradient(180deg, #CBD7EF 0%, #9A9FD0 100%)',
    gold: 'linear-gradient(180deg, #FFD800 0%, #FDAB32 100%)',
    ...sharedGrad,
  },
}

export const darkColors: Colors = {
  ...baseColors,
  ...additionalColors,
  background: '#000000',
  backgroundDisabled: '#18191A',
  backgroundAlt: '#18191A',
  backgroundAlt2: '#18191A',
  cardBorder: '#000000',
  contrast: '#2196f3',
  dropdown: '#18191A',
  dropdownDeep: '#010f2f',
  invertedContrast: '#191326',
  input: '#18191A',
  inputSecondary: '#18191A',
  tertiary: '#353547',
  text: '#FFFFFF',
  textSecondary: '#FFFFFF',
  textDisabled: '#524B63',
  textSubtle: '#FFFFFF',
  disabled: '#524B63',
  gradients: {
    bubblegum: 'linear-gradient(139.73deg, #313D5C 0%, #3D2A54 100%)',
    inverseBubblegum: 'linear-gradient(139.73deg, #3D2A54 0%, #313D5C 100%)',
    cardHeader: 'linear-gradient(166.77deg, #3B4155 0%, #3A3045 100%)',
    blue: 'linear-gradient(180deg, #00707F 0%, #19778C 100%)',
    violet: 'linear-gradient(180deg, #6C4999 0%, #6D4DB2 100%)',
    violetAlt: 'linear-gradient(180deg, #434575 0%, #66578D 100%)',
    gold: 'linear-gradient(180deg, #FFD800 0%, #FDAB32 100%)',
    ...sharedGrad,
  },
}
