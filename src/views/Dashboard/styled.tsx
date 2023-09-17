import styled from 'styled-components'
import { Paper } from 'uikit'

export const StyledBorderCard = styled(Paper)`
  padding: 24px;
  height: 100%;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`
