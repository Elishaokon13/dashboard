import React from 'react'
import { StyledAnimatedIconComponent, StyledIconContainer } from './styles'
import { IconComponentType } from './types'

const AnimatedIconComponent: React.FC<IconComponentType> = ({
  Icon,
  IconFilled,
  color = 'textSubtle',
  activeColor = 'secondary',
  activeBackgroundColor,
  isActive = false,
  ...props
}) => {
  const hasFillIcon = IconFilled !== undefined
  return Icon ? (
    <StyledAnimatedIconComponent isActive={isActive} hasFillIcon={hasFillIcon} {...props}>
      <StyledIconContainer activeBackgroundColor={activeBackgroundColor}>
        <Icon color={color} />
      </StyledIconContainer>
      {hasFillIcon && (
        <StyledIconContainer activeBackgroundColor={activeBackgroundColor} {...props}>
          <IconFilled color={activeColor} />
        </StyledIconContainer>
      )}
    </StyledAnimatedIconComponent>
  ) : null
}

export default AnimatedIconComponent
