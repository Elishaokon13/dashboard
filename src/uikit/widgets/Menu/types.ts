import { ElementType, ReactElement } from 'react'
import { FlexProps } from '../../components/Box'
import { FooterLinkType } from '../../components/Footer/types'
import { MenuItemsType } from '../../components/MenuItems/types'
import { SubMenuItemsType } from '../../components/SubMenuItems/types'
import { Colors } from '../../theme/types'

export interface Language {
  code: string
  language: string
  locale: string
}

export interface LinkStatus {
  text: string
  color: keyof Colors
}

export interface NavProps {
  showBanner?: boolean
  headerMaxWidth?: string
  autoHide?: boolean
  linkComponent?: ElementType
  userMenu?: ReactElement
  headerMenuFlexProps?: FlexProps
  banner?: ReactElement
  globalMenu?: ReactElement
  links: Array<MenuItemsType>
  subLinks?: Array<SubMenuItemsType>
  footerLinks?: Array<FooterLinkType>
  activeItem: string
  activeSubItem: string
  leftSide?: ReactElement
  isDark: boolean
  toggleTheme: (isDark: boolean) => void
  cakePriceUsd?: number | string
  buyCakeLabel?: string
  currentLang?: string
  langs?: Language[]
  setLang?: (lang: Language) => void
  showFooter?: boolean
  additionalActions?: ReactElement
  menuItemsProps: FlexProps
}
