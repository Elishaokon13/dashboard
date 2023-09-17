/* eslint-disable react/no-array-index-key */
import React, { useContext, useEffect, useState } from 'react'
import { usePopper } from 'react-popper'
import SingletonRouter from 'next/router'
import { useOnClickOutside } from '../../hooks'
import { MenuContext } from '../../widgets/Menu/context'
import { Box, Flex } from '../Box'
import { LogoutIcon } from '../Svg'
import {
  DropdownMenuDivider,
  DropdownMenuItem,
  StyledDropdownMenu,
  LinkStatus,
  StyledDropdownMenuItemContainer,
} from './styles'
import { DropdownMenuItemType, DropdownMenuProps } from './types'

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  isBottomNav = false,
  showItemsOnMobile = false,
  activeItem = '',
  items = [],
  index,
  doubleClickHref,
  setMenuOpenByIndex,
  ...props
}) => {
  const { linkComponent } = useContext(MenuContext)
  const [isOpen, setIsOpen] = useState(false)
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null)
  const [tooltipRef, setTooltipRef] = useState<HTMLDivElement | null>(null)

  const hasItems = items.length > 0
  const { styles, attributes, update } = usePopper(targetRef, tooltipRef, {
    strategy: isBottomNav ? 'absolute' : 'fixed',
    placement: isBottomNav ? 'top' : 'bottom-start',
    modifiers: [{ name: 'offset', options: { offset: [0, isBottomNav ? 6 : 0] } }],
  })

  const isMenuShow = isOpen && ((isBottomNav && showItemsOnMobile) || !isBottomNav)

  useEffect(() => {
    const showDropdownMenu = () => {
      setIsOpen(true)
      if (update) update()
    }

    const hideDropdownMenu = (evt: MouseEvent | TouchEvent) => {
      const target = evt.target as Node
      return target && !tooltipRef?.contains(target) && setIsOpen(false)
    }

    targetRef?.addEventListener('mouseenter', showDropdownMenu)
    targetRef?.addEventListener('mouseleave', hideDropdownMenu)

    return () => {
      targetRef?.removeEventListener('mouseenter', showDropdownMenu)
      targetRef?.removeEventListener('mouseleave', hideDropdownMenu)
    }
  }, [targetRef, tooltipRef, setIsOpen, isBottomNav, update])

  useEffect(() => {
    if (setMenuOpenByIndex && index !== undefined) {
      setMenuOpenByIndex((prevValue) => ({ ...prevValue, [index]: isMenuShow }))
    }
  }, [isMenuShow, setMenuOpenByIndex, index])

  useOnClickOutside(targetRef, () => {
    setIsOpen(false)
  })
  return (
    <Box ref={setTargetRef} {...props}>
      <Box
        onPointerDown={() => {
          setIsOpen((s) => !s)
          if (isOpen && doubleClickHref) {
            SingletonRouter.push(doubleClickHref)
          }
        }}
      >
        {children}
      </Box>
      {hasItems && (
        <StyledDropdownMenu
          style={styles.popper}
          ref={setTooltipRef}
          {...attributes.popper}
          $isBottomNav={isBottomNav}
          $isOpen={tooltipRef && isMenuShow}
        >
          {isMenuShow &&
            items.map(
              ({ type = DropdownMenuItemType.INTERNAL_LINK, label, href = '/', status, ...itemProps }, itemItem) => {
                const MenuItemContent = (
                  <>
                    {label}
                    {status && (
                      <LinkStatus color={status.color} fontSize="14px">
                        {status.text}
                      </LinkStatus>
                    )}
                  </>
                )
                const isActive = href === activeItem
                return (
                  <StyledDropdownMenuItemContainer key={itemItem}>
                    {type === DropdownMenuItemType.BUTTON && (
                      <DropdownMenuItem $isActive={isActive} type="button" {...itemProps}>
                        {MenuItemContent}
                      </DropdownMenuItem>
                    )}
                    {type === DropdownMenuItemType.INTERNAL_LINK && (
                      <DropdownMenuItem
                        $isActive={isActive}
                        as={linkComponent}
                        href={href}
                        onClick={() => {
                          setIsOpen(false)
                        }}
                        {...itemProps}
                      >
                        {MenuItemContent}
                      </DropdownMenuItem>
                    )}
                    {type === DropdownMenuItemType.EXTERNAL_LINK && (
                      <DropdownMenuItem
                        $isActive={isActive}
                        as="a"
                        href={href}
                        target="_blank"
                        onClick={() => {
                          setIsOpen(false)
                        }}
                        {...itemProps}
                      >
                        <Flex alignItems="center" justifyContent="space-between" width="100%">
                          {label}
                          <LogoutIcon />
                        </Flex>
                      </DropdownMenuItem>
                    )}
                    {type === DropdownMenuItemType.DIVIDER && <DropdownMenuDivider />}
                  </StyledDropdownMenuItemContainer>
                )
              },
            )}
        </StyledDropdownMenu>
      )}
    </Box>
  )
}

export default DropdownMenu
