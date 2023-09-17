import React, { useContext } from 'react'
import { MenuContext } from '../../widgets/Menu/context'
import { Flex } from '../Box'
import { DropdownMenuItemType } from '../DropdownMenu/types'
import { StyledBottomNavItem, StyledBottomNavText } from './styles'
import { BottomNavItemProps } from './types'
import AnimatedIconComponent from '../Svg/AnimatedIconComponent'

const BottomNavItem: React.FC<BottomNavItemProps> = ({
  label,
  href,
  Icon,
  showItemsOnMobile = false,
  isActive = false,
  type,
  endIcon,
  ...props
}) => {
  const { linkComponent } = useContext(MenuContext)
  const bottomNavItemContent = (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" height="100%">
      {Icon && (
        <AnimatedIconComponent
          Icon={Icon}
          height="22px"
          width="21px"
          color={isActive ? 'primary' : 'text'}
          isActive={isActive}
        />
      )}
      {!Icon && (
        <StyledBottomNavText color={isActive ? 'primary' : 'text'} fontWeight="500" fontSize="14px">
          {label} {endIcon}
        </StyledBottomNavText>
      )}
    </Flex>
  )

  const itemProps: any = {}

  if (!showItemsOnMobile) {
    itemProps.as = linkComponent
    itemProps.href = href
    if (type === DropdownMenuItemType.EXTERNAL_LINK) {
      itemProps.target = '_blank'
      itemProps.rel = 'noreferrer'
    }
  } else {
    itemProps.type = 'button'
  }

  return (
    <StyledBottomNavItem {...itemProps} {...props}>
      {bottomNavItemContent}
    </StyledBottomNavItem>
  )
}

export default BottomNavItem
