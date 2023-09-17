import { DropdownMenuItemType } from '../DropdownMenu/types'
import { SvgProps } from '../Svg'

export interface BottomNavItemProps {
  label: string
  href: string
  Icon?: React.FC<SvgProps>
  isActive?: boolean
  showItemsOnMobile?: boolean
  type?: DropdownMenuItemType
  endIcon?: JSX.Element
}
