import React, { useContext } from 'react'
import styled, { keyframes } from 'styled-components'
import Flex from '../../../components/Box/Flex'
import { MenuContext } from '../context'
import Image from 'next/image'
import LogoSrc from 'assets/limitlesslogo.png'

interface Props {
  isDark: boolean
  href: string
}

const blink = keyframes`
  0%,  100% { transform: scaleY(1); }
  50% { transform:  scaleY(0.1); }
`

const StyledLink = styled('a')`
  display: flex;
  align-items: center;
  .mobile-icon {
    width: 32px;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: none;
    }
  }
  .desktop-icon {
    width: 160px;
    display: none;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: block;
    }
  }
  .eye {
    animation-delay: 20ms;
  }
  transition: 0.2s ease;
  padding-right: 0.5em;
  &:hover {
    .eye {
      transform-origin: center 60%;
      animation-name: ${blink};
      animation-duration: 350ms;
      animation-iteration-count: 1;
    }
  }
`

const Logo: React.FC<Props> = ({ href }) => {
  const { linkComponent } = useContext(MenuContext)
  const isAbsoluteUrl = href.startsWith('http')
  // const router = useRouter()
  // const isActive = router.pathname === '/'
  const innerLogo = (
    <>
      <Image src={LogoSrc} alt="Logo" width={40} height={40} />
      {/* <LogoIcon color="primary" width="50px" marginRight="1em" />{' '}
      <Text color={isActive ? 'secondaryDark' : 'text'} fontSize="1.5em" fontWeight="500">
        Limitless
      </Text> */}
    </>
  )

  return (
    <Flex>
      {isAbsoluteUrl ? (
        <StyledLink as="a" href={href} aria-label="Limitless home page">
          {innerLogo}
        </StyledLink>
      ) : (
        <StyledLink href={href} as={linkComponent} aria-label="Limitless home page">
          {innerLogo}
        </StyledLink>
      )}
    </Flex>
  )
}

export default React.memo(Logo, (prev, next) => prev.isDark === next.isDark)
