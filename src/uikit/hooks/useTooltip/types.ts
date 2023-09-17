import { ElementType } from 'react'
import { Placement, Padding } from '@popperjs/core'

export interface TooltipRefs {
  targetRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>
  tooltip: React.ReactNode
  tooltipVisible: boolean
  update: () => any
}

export interface TooltipOptions {
  CustomTooltipContainer?: React.FC | ElementType
  placement?: Placement
  trigger?: TriggerType
  showArrow?: boolean
  arrowPadding?: Padding
  tooltipPadding?: Padding
  tooltipOffset?: [number, number]
  disablePortal?: boolean
}

export type TriggerType = 'click' | 'hover' | 'focus'
