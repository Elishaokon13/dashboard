import styled from 'styled-components'
import Box from './Box'
import { BoxProps } from './types'

const Paper = styled(Box) <BoxProps>`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.card};
  overflow: hidden;
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows.paper};
  ${({ theme, background }) => `background:${theme.colors[background || 'background']};`}

`

export default Paper
