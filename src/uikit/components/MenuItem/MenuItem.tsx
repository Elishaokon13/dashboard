import React, { useContext } from 'react'
import { MenuContext } from '../../widgets/Menu/context'
import StyledMenuItem, { StyledMenuItemContainer } from './styles'
import { MenuItemProps } from './types'
import { DropdownMenuItemType } from '../DropdownMenu/types'

const MenuItem: React.FC<MenuItemProps> = ({
  children,
  href,
  isActive = false,
  variant = 'default',
  statusColor,
  type,
  ...props
}) => {
  const { linkComponent } = useContext(MenuContext)

  const itemLinkProps: any = {}

  if (href) {
    itemLinkProps.as = linkComponent
    itemLinkProps.href = href

    if (type === DropdownMenuItemType.EXTERNAL_LINK) {
      itemLinkProps.target = '_blank'
      itemLinkProps.rel = 'noreferrer'
    }
  } else {
    itemLinkProps.as = 'div'
  }

  return (
    <StyledMenuItemContainer $isActive={isActive} $variant={variant}>
      <StyledMenuItem {...itemLinkProps} $isActive={isActive} $variant={variant} $statusColor={statusColor} {...props}>
        {children}
      </StyledMenuItem>
    </StyledMenuItemContainer>
  )
}

export default MenuItem
