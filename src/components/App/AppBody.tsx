import React from 'react'
import styled from 'styled-components'
import { Card } from 'uikit'

export const BodyWrapper = styled(Card) <{ lgHeight?: string }>`
  border-radius: ${({ theme }) => theme.radii.default};
  max-width: 500px;
  width: 100%;
  z-index: 1;
  padding: 0;
  ${({ theme }) => theme.mediaQueries.lg} {
    min-height: ${({ lgHeight }) => lgHeight || 'auto'};
  }
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children, lgHeight }: { children: React.ReactNode; lgHeight?: string }) {
  return <BodyWrapper lgHeight={lgHeight}>{children}</BodyWrapper>
}
