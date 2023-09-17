/* eslint-disable @typescript-eslint/no-explicit-any */
import { FlexProps } from '../Box'
import { SvgProps } from '../Svg'

export type SubMenuItemsType = {
  label: string
  href: string
  itemProps?: any
  Icon?: React.FC<SvgProps>
  isMobileOnly?: boolean
}

export interface SubMenuItemsProps extends FlexProps {
  items: SubMenuItemsType[]
  activeItem?: string
  isMobileOnly?: boolean
}
