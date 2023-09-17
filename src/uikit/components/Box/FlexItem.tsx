import styled from 'styled-components'
import { background, border, flexbox, layout, position, space } from 'styled-system'
import { FlexItemProps } from './types'

const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']

const FlexItem = styled.div<FlexItemProps>`
  ${background}
  ${border}
  ${layout}
  ${position}
  ${space}
  ${flexbox}
  ${({ theme, ...rest }) => {
    let style = ''
    // eslint-disable-next-line no-restricted-syntax
    for (const breakpoint of breakpoints) {
      const point = rest[breakpoint]
      if (point !== undefined) {
        const p: number = (point / 12) * 100
        style += `
            ${theme.mediaQueries[breakpoint]} {
              flex-basis: ${p}%;
              max-width: ${p}%;
            }
          `
      }
    }
    return style
  }}
`

export default FlexItem
