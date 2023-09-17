import Image from 'next/image'
import React from 'react'
import styled from 'styled-components'
import { Box, BoxProps } from 'uikit'

interface StyledBoxProps extends BoxProps {
  showIn?: string
}

interface RibbonProps extends StyledBoxProps {
  ribbon: any
}

// this is probably the better way... useMatchBreakpoints acting kinda weird in SSR.
// Plus, useMatchBreakpoints is kinda expensive due to bunch of listener registers.
const StyledBox = styled(Box)<StyledBoxProps>`
  display: none;
  ${({ theme, showIn = 'sm' }) => {
    return `
        ${theme.mediaQueries[showIn]}{
           display: block;
        }
      `
  }}
`

const Ribbon: React.FC<RibbonProps> = ({ ribbon, ...props }) => {
  return (
    <StyledBox position="relative" {...props}>
      <Image alt="ribbon" placeholder="blur" src={ribbon} />
    </StyledBox>
  )
}

export default Ribbon
