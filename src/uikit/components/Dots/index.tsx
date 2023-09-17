import React from 'react'
import styled from 'styled-components'
import { Box, BoxProps, Grid } from '../Box'

export interface DotsProps extends BoxProps {
  count: number
  size: string
  opacity: string
}

const StyledDot = styled(Box)`
  background: ${({ theme, color }) => theme.colors[color]};
`

const Dots: React.FC<DotsProps> = ({ count = 36, color = 'primary', size = '160px', opacity = '0.3', ...rest }) => {
  const spacing = parseInt(size) / Math.sqrt(36)
  const AllDots = []
  for (let i = 0; i < count; i++) {
    AllDots.push(<StyledDot key={i} width="8px" height="8px" borderRadius="100%" color={color} />)
  }
  return (
    <Grid
      style={{ opacity }}
      width={size}
      height={size}
      gridTemplateColumns={`repeat(auto-fit, ${spacing}px)`}
      {...rest}
    >
      {AllDots}
    </Grid>
  )
}

export default React.memo(Dots)
