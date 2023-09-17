import styled, { DefaultTheme } from 'styled-components'
import { space, layout, variant } from 'styled-system'
import { scaleVariants, styleVariants } from './theme'
import { BaseButtonProps } from './types'

interface ThemedButtonProps extends BaseButtonProps {
  theme: DefaultTheme
}

interface TransientButtonProps extends ThemedButtonProps {
  $isLoading?: boolean
}

const getDisabledStyles = ({ $isLoading, theme }: TransientButtonProps) => {
  if ($isLoading === true) {
    return `
      &:disabled,
      &.button--disabled {
        cursor: not-allowed;
      }
    `
  }

  return `
    &:disabled,
    &.button--disabled {
      background-color: ${theme.colors.backgroundDisabled};
      border-color: ${theme.colors.backgroundDisabled};
      box-shadow: none;
      color: ${theme.colors.textDisabled};
      cursor: not-allowed;
    }
  `
}

/**
 * This is to get around an issue where if you use a Link component
 * React will throw a invalid DOM attribute error
 * @see https://github.com/styled-components/styled-components/issues/135
 */

const getOpacity = ({ $isLoading = false }: TransientButtonProps) => {
  return $isLoading ? '.5' : '1'
}

const StyledButton = styled.button<BaseButtonProps>`
  align-items: center;
  text-align: center;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.default};
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  transition-property: background-color, box-shadow, border-color, color;
  transition-duration: 250ms, 250ms, 250ms, 250ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1), cubic-bezier(0.4, 0, 0.2, 1), cubic-bezier(0.4, 0, 0.2, 1),
    cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0ms, 0ms, 0ms, 0ms;
  box-shadow: ${({ shadow }) =>
    shadow || 'rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px;'}
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  justify-content: center;
  letter-spacing: 0.03em;
  line-height: 1;
  opacity: ${getOpacity};
  outline: 0;
  transition: 0.2s ease;
  user-select: none;   
  &:hover:not(:disabled):not(.button--disabled):not(.button--disabled):not(:active) {
    box-shadow: 5px 5px 10px #1a1a1a26;
  }

  &:active:not(:disabled):not(.button--disabled):not(.button--disabled) {
    transform: translateY(1px);
  }

  ${getDisabledStyles}
  ${variant({
      prop: 'scale',
      variants: scaleVariants,
    })}
  ${variant({
      variants: styleVariants,
    })}
  ${layout}
  ${space}
`

export default StyledButton
