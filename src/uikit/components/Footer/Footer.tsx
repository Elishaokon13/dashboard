import React from 'react'
import NextLink from 'next/link'
import { Flex, FlexItem } from '../Box'
import { StyledFooter, StyledText } from './styles'
import SocialLinks from './Components/SocialLinks'
import { FooterLinkType } from './types'
import { breakpointMap } from '../../theme/base'

const Footer: React.FC<{ footerLinks: FooterLinkType[] }> = ({ footerLinks }) => {
  return (
    <StyledFooter p={['40px 15px 60px 15px', null, '40px']} justifyContent="center">
      <Flex maxWidth={breakpointMap.lg} container alignItems="center">
        <FlexItem xs={12} md={12}>
          <SocialLinks />
          <br />
          <StyledText textAlign={{ xs: 'center', md: 'left' }} fontSize="small" bold color="inherit">
            Copyright &copy; 2023 Limitless Network
          </StyledText>
        </FlexItem>
      </Flex>
    </StyledFooter>
  )
}

export default React.memo(Footer)
