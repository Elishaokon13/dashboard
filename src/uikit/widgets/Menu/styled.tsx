import styled from 'styled-components'
import { Box } from '../../components/Box'
import { MENU_HEIGHT } from './config'
import { breakpointMap } from '../../theme/base'

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
`

export const StyledNav = styled.nav<{ maxWidth: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${MENU_HEIGHT}px;
  transform: translate3d(0, 0, 0);
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
  max-width: ${({ maxWidth = 'lg' }) => maxWidth && `${breakpointMap[maxWidth]}px`};
`

export const FixedContainer = styled.div<{ showMenu: boolean; height: number; transparent: boolean }>`
  position: fixed;
  top: ${({ showMenu, height }) => (showMenu ? '0px' : `-${height}px`)};
  left: 0;
  transition: top 0.2s;
  height: ${({ height }) => `${height}px`};
  width: 100%;
  z-index: 20;
  background: ${({ transparent, theme }) => (transparent ? 'transparent' : `${theme.colors.backgroundAlt}90`)};
  transition: 0.2s ease;
  backdrop-filter: blur(10px);
`

export const TopBannerContainer = styled.div<{ height: number }>`
  height: ${({ height }) => `${height}px`};
  min-height: ${({ height }) => `${height}px`};
  max-height: ${({ height }) => `${height}px`};
  width: 100%;
  margin: 0 auto;
`

export const BodyWrapper = styled(Box)`
  position: relative;
  display: flex;
`

export const Inner = styled.div<{ isPushed: boolean; showMenu: boolean; contentPadding: number }>`
  display: flex;
  flex-direction: column;
  min-height: ${({ contentPadding }) => `calc(100vh - ${contentPadding}px)`};
  transition: margin-top 0.2s, margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(0, 0, 0);
  width: 100%;
  margin: 0 auto;
`

export const InnerContent = styled.div`
  flex: 1;
`
