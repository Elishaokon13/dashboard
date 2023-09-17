import noop from 'lodash/noop'
import { ChartIcon, EarnIcon, MoreIcon, SwapIcon, TrophyIcon } from '../../components/Svg'
import { DropdownMenuItems, DropdownMenuItemType } from '../../components/DropdownMenu/types'
import { MenuItemsType } from '../../components/MenuItems/types'
import { LinkStatus } from './types'

export const status = {
  LIVE: <LinkStatus>{
    text: 'LIVE',
    color: 'failure',
  },
  SOON: <LinkStatus>{
    text: 'SOON',
    color: 'warning',
  },
  NEW: <LinkStatus>{
    text: 'NEW',
    color: 'success',
  },
}

export const links: MenuItemsType[] = [
  {
    label: 'Trade',
    href: '/swap',
    Icon: SwapIcon,
    items: [
      {
        label: 'Exchange',
        href: '/swap',
      },
      {
        label: 'Liquidity',
        href: '/liquidity',
      },
      {
        label: 'Charts',
        href: '/charts',
        Icon: ChartIcon,
        isMobileOnly: true,
      },
    ],
  },
  {
    label: 'Earn',
    href: '/earn',
    Icon: EarnIcon,
    items: [
      {
        label: 'Earn',
        href: '/earn',
      },
      {
        label: 'Yield Farms',
        href: '/farms',
      },
      {
        label: 'Syrup pools',
        href: '/pools',
      },
    ],
  },
  {
    label: 'Win',
    href: '/',
    Icon: TrophyIcon,
    items: [
      {
        label: 'Win',
        href: '/',
      },
      {
        label: 'Predictions',
        href: '/',
        status: status.LIVE,
      },
      {
        label: 'Lottery',
        href: '/',
      },
    ],
  },
  {
    label: '',
    href: '/',
    Icon: MoreIcon,
    items: [
      {
        label: 'Info & Analytics',
        href: '/',
      },
      {
        label: 'IFO Token Sales',
        href: '/',
        status: status.SOON,
      },
      {
        type: DropdownMenuItemType.DIVIDER,
      },
      {
        label: 'NFT Collectibles',
        href: '/',
      },
      {
        label: 'Team Leaderboard',
        href: '/',
      },
      {
        type: DropdownMenuItemType.DIVIDER,
      },
      {
        label: 'Blog',
        href: '/',
      },
      {
        label: 'Docs & Guides',
        href: '/',
        type: DropdownMenuItemType.EXTERNAL_LINK,
      },
    ],
  },
]

export const userMenulinks: DropdownMenuItems[] = [
  {
    label: 'Wallet',
    onClick: noop,
    type: DropdownMenuItemType.BUTTON,
  },
  {
    label: 'Transactions',
    type: DropdownMenuItemType.BUTTON,
  },
  {
    type: DropdownMenuItemType.DIVIDER,
  },
  {
    type: DropdownMenuItemType.BUTTON,
    disabled: true,
    label: 'Dashboard',
  },
  {
    type: DropdownMenuItemType.BUTTON,
    disabled: true,
    label: 'Portfolio',
  },
  {
    label: 'Profile',
    href: '/profile',
  },
  {
    type: DropdownMenuItemType.EXTERNAL_LINK,
    href: 'https://pancakeswap.finance',
    label: 'Link',
  },
  {
    type: DropdownMenuItemType.DIVIDER,
  },
  {
    type: DropdownMenuItemType.BUTTON,
    onClick: noop,
    label: 'Disconnect',
  },
]

export const MENU_HEIGHT = 75
export const MENU_ENTRY_HEIGHT = 48
export const MOBILE_MENU_HEIGHT = 44
export const SIDEBAR_WIDTH_FULL = 240
export const SIDEBAR_WIDTH_REDUCED = 56
export const TOP_BANNER_HEIGHT = 70
export const TOP_BANNER_HEIGHT_MOBILE = 84
