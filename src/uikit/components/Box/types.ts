import { HTMLAttributes } from 'react'
import {
  BackgroundProps,
  BorderProps,
  FlexboxProps,
  LayoutProps,
  PositionProps,
  SpaceProps,
  GridProps as _GridProps,
  ResponsiveValue,
} from 'styled-system'

export interface BoxProps
  extends BackgroundProps,
    BorderProps,
    LayoutProps,
    PositionProps,
    SpaceProps,
    HTMLAttributes<HTMLDivElement> {
  background?: string
}

export interface FlexItemProps extends BoxProps, FlexboxProps {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  xxl?: number
}

export interface FlexProps extends BoxProps, FlexboxProps {
  spacing?: ResponsiveValue<string | number> | undefined
  container?: boolean
}

export interface GridProps extends FlexProps, _GridProps {}
