import styled from 'styled-components'
import { StyledMenuItemProps } from './types'

export const StyledMenuItemContainer = styled.div<StyledMenuItemProps>`
  position: relative;
  cursor: pointer;
  ${({ $isActive, $variant, theme }) =>
    $isActive &&
    $variant === 'subMenu' &&
    `
      &:after{
        content: "";
        position: absolute;
        bottom: 0;
        height: 4px;
        width: 100%;
        background-color: ${theme.colors.primary};
        border-radius: 2px 2px 0 0;
      }
    `};
`

const StyledMenuItem = styled.a<StyledMenuItemProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, $isActive }) => ($isActive ? theme.colors.primary : theme.colors.textSubtle)};
  font-size: 18px;
  font-weight: bold;
  ${({ $statusColor, theme }) =>
    $statusColor &&
    `
    &:after {
      content: "";
      border-radius: 100%;
      background: ${theme.colors[$statusColor]};
      height: 8px;
      width: 8px;
      margin-left: 12px;
    }
  `}

  ${({ $variant }) =>
    $variant === 'default'
      ? `
    padding: 0 24px;
    height: 48px;
  `
      : `
    padding: 4px 4px 0px 4px;
    height: 42px;
  `}

  &:hover {
    background: ${({ theme }) => theme.colors.tertiary};
    ${({ $variant, theme }) => $variant === 'default' && `border-radius: ${theme.radii.default}`};
  }
`

export default StyledMenuItem
