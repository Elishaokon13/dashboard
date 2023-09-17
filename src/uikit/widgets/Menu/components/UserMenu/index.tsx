import React, { useEffect, useState } from 'react'
import { usePopper } from 'react-popper'
import styled from 'styled-components'
import { Box, Flex } from '../../../../components/Box'
import { ChevronDownIcon } from '../../../../components/Svg'
import { UserMenuProps, variants } from './types'
import MenuIcon from './MenuIcon'
import { UserMenuItem } from './styles'

export const StyledUserMenu = styled(Flex)`
  align-items: center;
  border-radius: 16px;
  box-shadow: inset 0px 2px 2px rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  display: inline-flex;
  height: 32px;
  padding-left: 40px;
  padding-right: 8px;
  position: relative;

  &:hover {
    opacity: 0.65;
  }
`

export const LabelText = styled.div`
  color: ${({ theme }) => theme.colors.text};
  display: none;
  font-weight: 600;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
    margin-left: 8px;
    margin-right: 4px;
  }
`

const Menu = styled.div<{ isOpen: boolean }>`
  background-color: ${({ theme }) => theme.card.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  padding-bottom: 4px;
  padding-top: 4px;
  pointer-events: auto;
  width: 280px;
  visibility: visible;
  z-index: 1001;

  ${({ isOpen }) =>
    !isOpen &&
    `
    pointer-events: none;
    visibility: hidden;
  `}

  ${UserMenuItem}:first-child {
    border-radius: 5px 5px 0 0;
  }

  ${UserMenuItem}:last-child {
    border-radius: 0 0 5px 5px;
  }
`

const UserMenu: React.FC<UserMenuProps> = ({
  account,
  text,
  avatarSrc,
  variant = variants.DEFAULT,
  children,
  disabled,
  iconOnly,
  placement = 'bottom-end',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null)
  const [tooltipRef, setTooltipRef] = useState<HTMLDivElement | null>(null)
  const accountEllipsis = account ? `${account.substring(0, 2)}...${account.substring(account.length - 4)}` : null
  const { styles, attributes, update } = usePopper(targetRef, tooltipRef, {
    strategy: 'fixed',
    placement,
    modifiers: [{ name: 'offset', options: { offset: [0, 0] } }],
  })

  useEffect(() => {
    const showDropdownMenu = () => {
      setIsOpen(true)
      if (update) update()
    }

    const hideDropdownMenu = (evt: MouseEvent | TouchEvent) => {
      const target = evt.target as Node
      if (target && !tooltipRef?.contains(target)) {
        setIsOpen(false)
        evt.stopPropagation()
      }
    }

    targetRef?.addEventListener('mouseenter', showDropdownMenu)
    targetRef?.addEventListener('mouseleave', hideDropdownMenu)

    return () => {
      targetRef?.removeEventListener('mouseenter', showDropdownMenu)
      targetRef?.removeEventListener('mouseleave', hideDropdownMenu)
    }
  }, [targetRef, tooltipRef, setIsOpen, update])

  return (
    <Flex alignItems="center" id="hey" height="100%" ref={setTargetRef} {...props}>
      <StyledUserMenu
        pr={iconOnly ? '0px !important' : undefined}
        onTouchStart={() => {
          setIsOpen((s) => !s)
        }}
      >
        <MenuIcon avatarSrc={avatarSrc} variant={variant} />
        {!iconOnly && (
          <LabelText title={typeof text === 'string' ? text || account : account}>{text || accountEllipsis}</LabelText>
        )}
        {!iconOnly && !disabled && <ChevronDownIcon color="text" width="24px" />}
      </StyledUserMenu>
      {!disabled && (
        <Menu style={styles.popper} ref={setTooltipRef} {...attributes.popper} isOpen={isOpen}>
          <Box onClick={() => setIsOpen(false)}>
            {typeof children === 'function' ? children?.({ isOpen }) : children}
          </Box>
        </Menu>
      )}
    </Flex>
  )
}

export default UserMenu
