import ItemsMock from '../DropdownMenu/mock'
import { MenuItemsType } from '../MenuItems/types'
import { EarnIcon, MoreIcon, NftIcon, SwapIcon, TrophyIcon } from '../Svg'

const MenuItemsMock: MenuItemsType[] = [
  {
    label: 'Swap',
    href: '/swap',
    Icon: SwapIcon,
    items: ItemsMock,
    showItemsOnMobile: false,
  },
  {
    label: 'Earn',
    href: '/earn',
    Icon: EarnIcon,
    items: ItemsMock,
    showItemsOnMobile: true,
  },
  {
    label: 'Gagnez des jetons',
    href: '/win',
    Icon: TrophyIcon,
    items: ItemsMock,
    showItemsOnMobile: true,
  },
  {
    label: 'NFT',
    href: '/nft',
    Icon: NftIcon,
    items: ItemsMock,
  },
  {
    label: 'More',
    href: '/more',
    Icon: MoreIcon,
    items: ItemsMock,
    showItemsOnMobile: true,
  },
]

export default MenuItemsMock
