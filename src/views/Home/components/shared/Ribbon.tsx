import Image from 'next/image'
import React from 'react'
import styled from 'styled-components'
import { Box, BoxProps } from 'uikit'

interface StyledBoxProps extends BoxProps {
  showIn?: string
}

interface RibbonProps extends StyledBoxProps {
  ribbon: any
  imageBorderRadius?: string | number
  transform?: string
}

// this is probably the better way... useMatchBreakpointsContext acting kinda weird in SSR.
// Plus, useMatchBreakpointsContext is kinda expensive due to bunch of listener registers.
const StyledBox = styled(Box)<StyledBoxProps & { transform?: string }>`
  display: none;
  ${({ theme, showIn = 'sm' }) => {
    return `
        ${theme.mediaQueries[showIn]}{
           display: block;
        }
      `
  }};
  ${({ transform }) => (transform ? `transform: ${transform}` : '')};
`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledImage = styled(({ imageBorderRadius, ...rest }) => <Image {...rest} />)<{
  imageBorderRadius?: number | string
}>`
  border-radius: ${({ imageBorderRadius }) => imageBorderRadius || '0px'};
`

const Ribbon: React.FC<RibbonProps> = ({ ribbon, imageBorderRadius, ...props }) => {
  return (
    <StyledBox position="relative" {...props}>
      <StyledImage alt="ribbon" src={ribbon} imageBorderRadius={imageBorderRadius} layout="fill" />
    </StyledBox>
  )
}

export default Ribbon
