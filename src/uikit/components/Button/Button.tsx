import React, { cloneElement, ElementType, isValidElement } from 'react'
import getExternalLinkProps from '../../util/getExternalLinkProps'
import StyledButton from './StyledButton'
import { ButtonProps, scales, variants } from './types'

const Button = React.forwardRef(<E extends ElementType = 'button'>(props: ButtonProps<E>, ref: any): JSX.Element => {
  const { startIcon, endIcon, external, className, isLoading, disabled, children, onClick, ...rest } = props
  const internalProps = external ? getExternalLinkProps() : {}
  const isDisabled = isLoading || disabled
  const classNames = className ? [className] : []

  if (isLoading) {
    classNames.push('button--loading')
  }

  if (isDisabled && !isLoading) {
    classNames.push('button--disabled')
  }

  return (
    <StyledButton
      ref={ref}
      $isLoading={isLoading}
      className={classNames.join(' ')}
      disabled={isDisabled}
      onClick={onClick}
      alt="Button"
      aria-label="Button"
      {...internalProps}
      {...rest}
    >
      <>
        {isValidElement(startIcon) &&
          cloneElement(startIcon, {
            // @ts-ignore
            mr: '0.5rem',
          })}
        {children}
        {isValidElement(endIcon) &&
          cloneElement(endIcon, {
            // @ts-ignore
            ml: '0.5rem',
          })}
      </>
    </StyledButton>
  )
})

Button.displayName = 'Button'
Button.defaultProps = {
  isLoading: false,
  external: false,
  variant: variants.PRIMARY,
  scale: scales.MD,
  disabled: false,
}

export default Button as <E extends ElementType = 'button'>(
  props: ButtonProps<E> & { ref?: any | undefined },
) => JSX.Element
