import { FlexProps } from '../Box'
import { DropdownMenuItems, DropdownMenuItemType } from '../DropdownMenu/types'
import { SvgProps } from '../Svg'

export type MenuItemsType = {
  label: string
  href: string
  Icon?: React.FC<SvgProps>
  items?: DropdownMenuItems[]
  showOnMobile?: boolean
  showOnTablet?: boolean
  showItemsOnMobile?: boolean
  onlyShowOnMobile?: boolean
  type?: DropdownMenuItemType
  endIcon?: JSX.Element
}

export interface MenuItemsProps extends FlexProps {
  items: MenuItemsType[]
  activeItem?: string
  activeSubItem?: string
  isTablet?: boolean
}
