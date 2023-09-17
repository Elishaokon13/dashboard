import React from 'react'
import { Flex } from '../Box'
import isTouchDevice from '../../util/isTouchDevice'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import MenuItem from '../MenuItem/MenuItem'
import { MenuItemsProps } from './types'
import { Text } from '../Text'

const MenuItems: React.FC<MenuItemsProps> = ({ items = [], activeItem, activeSubItem, isTablet, ...props }) => {
  return (
    <Flex {...props}>
      {items.reduce(
        (acc, { onlyShowOnMobile, showOnTablet = true, label, type, items: menuItems = [], href, Icon, endIcon }) => {
          if (!onlyShowOnMobile && (!isTablet || showOnTablet)) {
            const statusColor = menuItems?.find((menuItem) => menuItem.status !== undefined)?.status?.color
            const isActive = activeItem === href
            const linkProps = isTouchDevice() && menuItems && menuItems.length > 0 ? {} : { href }

            acc.push(
              <DropdownMenu
                key={`${label}#${href}`}
                items={menuItems.filter((item) => (!item.isTabletOnly || isTablet) && !item.isMobileOnly)}
                py={1}
                doubleClickHref={href}
                activeItem={activeSubItem}
              >
                <MenuItem {...linkProps} type={type} isActive={isActive} statusColor={statusColor}>
                  {label ? (
                    <Text fontWeight="500">{label}</Text>
                  ) : (
                    Icon && <Icon color={isActive ? 'secondary' : 'text'} />
                  )}{' '}
                  {endIcon}
                </MenuItem>
              </DropdownMenu>,
            )
          }
          return acc
        },
        [],
      )}
    </Flex>
  )
}

export default React.memo(MenuItems)
