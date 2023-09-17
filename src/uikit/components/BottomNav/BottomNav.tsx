import React, { useState } from 'react'
import BottomNavItem from '../BottomNavItem'
import StyledBottomNav from './styles'
import { Box } from '../Box'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import { BottomNavProps } from './types'
import { NotificationDot } from '../NotificationDot'
import { Overlay } from '../Overlay'

const BottomNav: React.FC<BottomNavProps> = ({ items = [], activeItem = '', activeSubItem = '', ...props }) => {
  const [menuOpenByIndex, setMenuOpenByIndex] = useState({})
  const isBottomMenuOpen = Object.values(menuOpenByIndex).reduce((acc, value) => acc || value, false)
  return (
    <>
      {isBottomMenuOpen && <Overlay />}
      <StyledBottomNav justifyContent="space-around" {...props}>
        {items.map(
          (
            { label, items: menuItems, type, href, Icon, endIcon, showOnMobile = true, showItemsOnMobile = true },
            index,
          ) => {
            const statusColor = menuItems?.find((menuItem) => menuItem.status !== undefined)?.status?.color
            return (
              showOnMobile && (
                <DropdownMenu
                  key={label}
                  doubleClickHref={href}
                  items={menuItems}
                  isBottomNav
                  activeItem={activeSubItem}
                  showItemsOnMobile={showItemsOnMobile}
                  setMenuOpenByIndex={setMenuOpenByIndex}
                  index={index}
                  width="100%"
                >
                  <Box>
                    <BottomNavItem
                      type={type}
                      href={href}
                      isActive={href === activeItem}
                      label={label}
                      Icon={Icon}
                      showItemsOnMobile={showItemsOnMobile}
                      endIcon={endIcon}
                    />
                  </Box>
                </DropdownMenu>
              )
            )
          },
        )}
      </StyledBottomNav>
    </>
  )
}

export default React.memo(BottomNav)
