import { ReactElement } from 'react'
import { SpaceProps } from 'styled-system'
import { NumberFormatProps } from 'react-number-format'

export const scales = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
} as const

export type Scales = typeof scales[keyof typeof scales]

export interface InputProps extends SpaceProps {
  scale?: Scales
  isSuccess?: boolean
  isWarning?: boolean
  borderColor?: string
}

export type NumberInputProps = InputProps & NumberFormatProps

export interface InputGroupProps extends SpaceProps {
  scale?: Scales
  startIcon?: ReactElement
  endIcon?: ReactElement
  children: JSX.Element
}
