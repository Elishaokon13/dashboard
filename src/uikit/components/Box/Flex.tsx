/* eslint-disable guard-for-in */
import styled from 'styled-components'
import { flexbox } from 'styled-system'
import Box from './Box'
import { FlexProps } from './types'

const Flex = styled(Box)<FlexProps>`
  display: flex;
  ${({ container, spacing, theme }) => {
    //make spacing responsive ->  spacing={{xs:"12px", lg:"24px"}}
    //not sure if there is a better styled-system way to do it... I been search through their repo issues but cant find any
    if (container) {
      let childrenCss = ''
      let parentCss = ''
      if (spacing) {
        if (typeof spacing === 'object') {
          // eslint-disable-next-line no-restricted-syntax
          for (const key in spacing) {
            const val = spacing[key]
            childrenCss += `
              ${theme.mediaQueries[key]}{
              padding: ${val} 0px 0px ${val};
            }`
            parentCss += `
              ${theme.mediaQueries[key]}{
                margin-left: -${val};
                margin-top: -${val};
              }
            `
          }
        } else {
          childrenCss = `
            padding: ${spacing} 0px 0px ${spacing};
          `
          parentCss = `
            margin-left: -${spacing};
            margin-top: -${spacing};
          `
        }
      }

      return `
        flex-flow: row wrap;
        ${parentCss}
         > * {${childrenCss}};
        `
    }
  }}
  ${flexbox}
`

export default Flex
