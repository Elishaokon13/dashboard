import React from 'react'
import styled from 'styled-components'
import { Box, BoxProps, Flex } from 'uikit'
import { PageMeta } from 'components/Layout/Page'
import AnimateLayout from 'components/AnimateLayout'

const StyledPage = styled(Flex) <{ $removePadding: boolean; background?: string; removePaddingTop?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  display: 'flex';
  width: 100%;
  padding: ${({ $removePadding }) => ($removePadding ? '0' : '16px')};
  background: ${({ theme, background = 'limitlessGrad2' }) => theme.colors.gradients[background]};

  ${({ theme }) => theme.mediaQueries.xs} {
    background-size: auto;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: ${({ $removePadding }) => ($removePadding ? '0' : '24px')};
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: ${({ $removePadding }) => ($removePadding ? '0' : '32px')};
  }

  padding-top: ${({ removePaddingTop }) => (removePaddingTop ? 0 : 32)}px !important;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: ${({ removePaddingTop }) => (removePaddingTop ? 0 : 58)}px !important;
  }
`

const Page: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    removePadding?: boolean
    hideFooterOnDesktop?: boolean
    background?: string
    removePaddingTop?: boolean
  } & BoxProps
> = ({ children, removePadding = false, ...props }) => {
  return (
    <>
      <PageMeta />
      <Box background="white" height="100%" width="100%">
        <StyledPage $removePadding={removePadding} {...props}>
          <AnimateLayout>{children}</AnimateLayout>
        </StyledPage>
      </Box>
    </>
  )
}

export default Page
