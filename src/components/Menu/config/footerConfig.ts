import { FooterLinkType } from 'uikit'
import { ContextApi } from 'contexts/Localization/types'
import { externalLinks } from 'utils/links'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
  {
    display: t('Docs'),
    href: externalLinks.developerDocumentation,
    isExternal: true,
  },
  {
    display: t('Contact'),
    href: '/contact',
    isExternal: false,
  },
  {
    display: t('Support'),
    href: externalLinks.support,
    isExternal: true,
  },
  {
    display: t('Terms of Use'),
    href: externalLinks.terms,
    isExternal: true,
  },
  {
    display: t('Privacy Policy'),
    href: externalLinks.privacy,
    isExternal: true,
  },
]