import styled from 'styled-components'
import { Flex } from '../Box'
import { Text } from '../Text'

export const StyledFooter = styled(Flex)`
  background: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  color: ${({ theme }) => theme.colors.text};
`

export const StyledText = styled(Text) <{ onlyInMobile: boolean }>`
  opacity: 0.8;
  ${({ onlyInMobile, theme }) =>
    onlyInMobile &&
    `
    ${theme.mediaQueries.md}{
      display: none
    }
  `}
`
