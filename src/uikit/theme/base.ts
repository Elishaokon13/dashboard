import { MediaQueries, Breakpoints, Spacing } from './types'

export const breakpointMap: { [key: string]: number } = {
  xs: 0,
  sm: 576,
  ms: 752,
  md: 852,
  lg: 968,
  xl: 1080,
  xxl: 1200,
}

const breakpoints: Breakpoints = Object.values(breakpointMap).map((breakpoint) => `${breakpoint}px`)
// using object alias aliases
Object.entries(breakpointMap).forEach(([key, breakpoint]) => (breakpoints[key] = `${breakpoint}px`))

const mediaQueries: MediaQueries = {
  xs: `@media screen and (min-width: ${breakpointMap.xs}px)`,
  sm: `@media screen and (min-width: ${breakpointMap.sm}px)`,
  ms: `@media screen and (min-width: ${breakpointMap.ms}px)`,
  md: `@media screen and (min-width: ${breakpointMap.md}px)`,
  lg: `@media screen and (min-width: ${breakpointMap.lg}px)`,
  xl: `@media screen and (min-width: ${breakpointMap.xl}px)`,
  xxl: `@media screen and (min-width: ${breakpointMap.xxl}px)`,
  nav: `@media screen and (min-width: ${breakpointMap.lg}px)`,
}

export const shadows = {
  level1: 'rgb(0 0 0 / 20%) 0px 5px 5px -3px, rgb(0 0 0 / 14%) 0px 8px 10px 1px, rgb(0 0 0 / 12%) 0px 3px 14px 2px',
  active: '0px 0px 0px 1px #0098A1, 0px 0px 4px 8px rgba(31, 199, 212, 0.4)',
  success: '0px 0px 0px 1px #31D0AA, 0px 0px 0px 4px rgba(49, 208, 170, 0.2)',
  warning: '0px 0px 0px 1px #ED4B9E, 0px 0px 0px 4px rgba(237, 75, 158, 0.2)',
  focus: '0px 0px 0px 1px #0693e3, 0px 0px 0px 2px #0693e350',
  inset: 'inset 0px 2px 2px -1px rgba(74, 74, 104, 0.1)',
  tooltip: '0px 0px 2px rgba(97, 97, 97, 0.92), 0px 4px 12px -8px rgba(97, 97, 97, 0.92)',
  paper: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
}

const spacing: Spacing = [0, 4, 8, 16, 24, 32, 48, 64]

const radii = {
  small: '2px',
  default: '5px',
  card: '5px',
  circle: '50%',
}

const zIndices = {
  dropdown: 10,
  modal: 100,
}

export default {
  siteWidth: 1200,
  breakpoints,
  mediaQueries,
  spacing,
  shadows,
  radii,
  zIndices,
}
