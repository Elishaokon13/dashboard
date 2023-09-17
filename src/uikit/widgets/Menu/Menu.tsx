import throttle from 'lodash/throttle'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import { Box } from '../../components/Box'
import Flex from '../../components/Box/Flex'
import Footer from '../../components/Footer'
import { useMatchBreakpointsContext } from '../../contexts'
import CakePrice from '../../components/CakePrice/CakePrice'
import Logo from './components/Logo'
import { MENU_HEIGHT, TOP_BANNER_HEIGHT_MOBILE } from './config'
import { NavProps } from './types'
import { MenuContext } from './context'
import { breakpointMap } from '../../theme/base'
import { SubMenuItemsProps } from '../../components/SubMenuItems'
import { Web3Button } from '@web3modal/react'
import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'
const MenuItems = dynamic(() => import('../../components/MenuItems/MenuItems'), { ssr: false })
const BottomNav = dynamic(() => import('../../components/BottomNav'), { ssr: false })
const SubMenuItems = dynamic<SubMenuItemsProps>(
  () => import('../../components/SubMenuItems').then((mod) => mod.SubMenuItems),
  {
    ssr: false,
  },
)

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`

const StyledNav = styled.nav<{ maxWidth: string }>`
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

const FixedContainer = styled.div<{ showMenu: boolean; height: number; transparent: boolean }>`
  position: fixed;
  top: 0px;
  opacity: ${({ showMenu }) => (showMenu ? 1 : 0)};
  &:hover {
    opacity: 1;
  }
  visibility: ${({ showMenu }) => (showMenu ? 'visible' : `hidden`)};
  ${({ theme }) => theme.mediaQueries.lg} {
    visibility: visible;
  }
  left: 0;
  height: ${({ height }) => `${height}px`};
  width: 100%;
  z-index: 20;
  background: ${({ transparent, theme }) => (transparent ? 'transparent' : `${theme.colors.backgroundAlt}90`)};
  transition: 0.2s ease;
  backdrop-filter: blur(10px);
`

const BodyWrapper = styled(Box)`
  position: relative;
  display: flex;
  transition: 0.4s ease;
  will-change: transform;
`

const Inner = styled.div<{ isPushed: boolean; showMenu: boolean; contentPadding: number }>`
  display: flex;
  flex-direction: column;
  min-height: ${({ contentPadding }) => `calc(100vh - ${contentPadding}px)`};
  transition: margin-top 0.2s, margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(0, 0, 0);
  width: 100%;
  margin: 0 auto;
`

const InnerContent = styled.div`
  flex: 1;
`



const initialHeaderState = { showMenu: true, transparent: true }

const Menu: React.FC<NavProps> = ({
  linkComponent = 'a',
  userMenu,
  banner,
  globalMenu,
  isDark,
  toggleTheme,
  currentLang,
  setLang,
  cakePriceUsd,
  links,
  subLinks,
  activeItem,
  activeSubItem,
  langs,
  children,
  footerLinks,
  showFooter = false,
  additionalActions,
  autoHide = true,
  menuItemsProps,
  headerMenuFlexProps,
  headerMaxWidth = 'lg',
  showBanner,
  leftSide,
}) => {
  const { isMobile, isMs, isTablet } = useMatchBreakpointsContext()
  const [headerState, setHeaderState] = useState(initialHeaderState)
  const pathname = usePathname()
  
  const showConnectButton = () => {
    if (pathname.includes('/swap') || pathname === ('/')){
      return false 
    } else{
      return <Web3Button icon="hide"/>
    }
  }

  const LeftSide = () => {
    return <h4>Limitless Network</h4>
  }

  const refPrevState = useRef({ offset: typeof window === 'undefined' ? 0 : window.pageYOffset, headerState: null })

  const topBannerHeight = TOP_BANNER_HEIGHT_MOBILE
  const contentPadding = showBanner ? topBannerHeight + 1 : 0

  const totalTopMenuHeight = showBanner ? MENU_HEIGHT + topBannerHeight : MENU_HEIGHT
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (autoHide) {
      const handleScroll = () => {
        const currentOffset = window.pageYOffset
        const isBottomOfPage = window.document.body.clientHeight === currentOffset + window.innerHeight
        const isTopOfPage = currentOffset <= 210
        // Always show the menu when user reach the top
        let newHeaderState = null
        if (isTopOfPage) {
          newHeaderState = {
            showMenu: true,
            transparent: true,
          }
        }
        // Avoid triggering anything at the bottom because of layout shift
        else if (!isBottomOfPage) {
          if (currentOffset < refPrevState.current.offset || currentOffset <= totalTopMenuHeight) {
            // Has scroll up
            newHeaderState = (state) => ({
              showMenu: true,
              transparent: state.transparent,
            })
          } else {
            // Has scroll down
            newHeaderState = {
              showMenu: false,
              transparent: false,
            }
          }
        }
        if (
          newHeaderState &&
          (refPrevState.current.headerState?.showMenu !== newHeaderState.showMenu ||
            refPrevState.current.headerState?.transparent !== newHeaderState.transparent)
        ) {
          // only update on the state change
          setHeaderState(newHeaderState)
          refPrevState.current.headerState = newHeaderState
        }
        refPrevState.current.offset = currentOffset
      }
      const throttledHandleScroll = throttle(handleScroll, 200)

      window.addEventListener('scroll', throttledHandleScroll)
      return () => {
        window.removeEventListener('scroll', throttledHandleScroll)
      }
    }
  }, [totalTopMenuHeight, autoHide])

  // Find the home link if provided
  const homeLink = links.find((link) => link.label === 'Home')
  const subLinksWithoutMobile = subLinks?.filter((subLink) => !subLink.isMobileOnly)
  const subLinksMobileOnly = subLinks?.filter((subLink) => subLink.isMobileOnly)

  return (
    <MenuContext.Provider value={{ linkComponent }}>
      <Wrapper>
        <FixedContainer
          showMenu={headerState.showMenu}
          height={totalTopMenuHeight}
          transparent={headerState.transparent}
        >
          <StyledNav maxWidth={headerMaxWidth}>
            <Flex>
              <Logo isDark={isDark} href={homeLink?.href ?? '/'} />
            </Flex>
            <LeftSide/>
            <Flex {...headerMenuFlexProps}>
              {!isMobile && !isMs && (
                <MenuItems
                  {...menuItemsProps}
                  items={links}
                  isTablet={isTablet}
                  activeItem={activeItem}
                  activeSubItem={activeSubItem}
                />
              )}
            </Flex>
            <Flex alignItems="center" height="100%">
              {!isMobile && !isTablet && cakePriceUsd !== undefined && (
                <Box mr="10px">
                  <CakePrice showLogo={!isMobile && !isTablet} cakePriceUsd={cakePriceUsd} />
                </Box>
              )}
              {globalMenu} {userMenu}
              {additionalActions}              
              {showConnectButton()}
            </Flex>
          </StyledNav>
        </FixedContainer>
        {subLinks && (
          <Flex justifyContent="space-around">
            <SubMenuItems items={subLinksWithoutMobile} mt={`${totalTopMenuHeight + 1}px`} activeItem={activeSubItem} />

            {subLinksMobileOnly?.length > 0 && (
              <SubMenuItems
                items={subLinksMobileOnly}
                mt={`${totalTopMenuHeight + 1}px`}
                activeItem={activeSubItem}
                isMobileOnly
              />
            )}
          </Flex>
        )}
        <BodyWrapper mt={`${contentPadding}px`}>
          <Inner isPushed={false} showMenu={headerState.showMenu} contentPadding={contentPadding}>
            <InnerContent>{children}</InnerContent>
            {showFooter && <Footer footerLinks={footerLinks} />}
          </Inner>
        </BodyWrapper>
        {(isMobile || isMs) && <BottomNav items={links} activeItem={activeItem} activeSubItem={activeSubItem} />}
      </Wrapper>
    </MenuContext.Provider>
  )
}

export default Menu
