import { DropdownMenuItemType, MenuItemsType, MoreIcon } from 'uikit'
import { ContextApi } from 'contexts/Localization/types'
import { externalLinks } from 'utils/links'

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [  
  {
    label: 'Home',
    href: 'https://www.limitlessnetwork.org/',
    // Icon: MoreIcon,
    hideSubNav: true,
    showItemsOnMobile: false,
  },{
    label: 'Swap',
    href: '/swap',
    // Icon: MoreIcon,
    hideSubNav: true,
    showItemsOnMobile: false,
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    // Icon: MoreIcon,
    hideSubNav: true,
    showItemsOnMobile: false,
  },
  // {
  //   label: 'About',
  //   href: '/mission',
  //   type: DropdownMenuItemType.INTERNAL_LINK,
  //   items: [
  //     {
  //       label: t('Mission'),
  //       href: '/mission',
  //     },
  //     {
  //       label: t('Token'),
  //       href: '/token',
  //     },
  //     {
  //       label: t('Team'),
  //       href: '/team',
  //     },
  //     {
  //       showItemsOnMobile: false,
  //       label: t('Whitepaper'),
  //       href: '/whitepaper.pdf',
  //       type: DropdownMenuItemType.EXTERNAL_LINK,
  //     },
  //   ],
  // },
]

export default config
