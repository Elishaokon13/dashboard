import { ComponentType } from 'react'
import styled, { DefaultTheme, StyledComponent } from 'styled-components'
import { space, typography, layout } from 'styled-system'
import { PolymorphicComponent } from 'uikit/util/polymorphic'
import getThemeValue from '../../util/getThemeValue'
import { TextProps } from './types'

interface ThemedProps extends TextProps {
  theme: DefaultTheme
}

const getColor = ({ color, theme }: ThemedProps) => {
  return getThemeValue(`colors.${color}`, color)(theme)
}

const StyledText = styled.div<ThemedProps>`
  color: ${getColor};
  font-weight: ${({ bold }) => (bold ? 600 : 400)};
  line-height: 1.5;
  ${({ textTransform }) => textTransform && `text-transform: ${textTransform};`}
  ${({ ellipsis }) =>
    ellipsis &&
    `white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;`}
  ${space}
  ${typography}
  ${layout}
`

StyledText.defaultProps = {
  color: 'inherit',
  small: false,
  ellipsis: false,
  fontSize: 'inherit',
}

interface PTextProps extends TextProps {
  as?: string | ComponentType<any>
}

const Text: PolymorphicComponent<PTextProps, 'div'> & { Styled: typeof StyledText } = ({
  as,
  ...props
}: PTextProps) => <StyledText as={as} {...props} fontSize={props.small ? '14px' : props.fontSize} />

Text.Styled = StyledText

export default Text
