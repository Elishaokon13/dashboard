import React from 'react'
import styled from 'styled-components'
import { externalLinks } from 'utils/links'
import { Link } from '../../Link'
import {
  SvgProps,
  DiscordIcon,
  TwitterIcon,
  TelegramIcon,
} from '../../Svg'

type SocialLink = {
  href: string
  name: string
  icon: React.FC<SvgProps>
}

const links: SocialLink[] = [
  {
    href: externalLinks.discord,
    icon: DiscordIcon,
    name: 'Discord',
  },
  {
    href: externalLinks.twitter,
    icon: TwitterIcon,
    name: 'Twitter',
  },
  {
    href: externalLinks.telegramgroup,
    icon: TelegramIcon,
    name: 'Telegram',
  },
]

const StyledIconButton = styled(Link)`
  margin-top: 10px;
  margin-right: 12px;
  display: inline-block;
` as typeof Link

const StyledContainer = styled.div`
  text-align: center;
  ${({ theme }) => theme.mediaQueries.md} {
    text-align: center;
  }
`

const SocialLinks: React.FC = () => {
  return (
    <StyledContainer>
      {links.map((link) => (
        <StyledIconButton href={link.href} external key={link.name} aria-label="Social Links">
          <link.icon width="28px" color="white" />
        </StyledIconButton>
      ))}
    </StyledContainer>
  )
}

export default SocialLinks
