import styled from 'styled-components'
import { Flex } from '../Box'

const StyledBottomNav = styled(Flex)`
  position: fixed;
  bottom: 0px;
  width: 100%;
  background: ${({ theme }) => theme.colors.backgroundAlt}90;
  backdrop-filter: blur(10px);
  padding-bottom: env(safe-area-inset-bottom);
  html[data-useragent*='TokenPocket_iOS'] & {
    padding-bottom: 45px;
  }
  z-index: 20;
`

export default StyledBottomNav
