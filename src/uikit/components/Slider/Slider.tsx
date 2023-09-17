import React, { ChangeEvent } from 'react'
import { useTooltip } from 'uikit/hooks'
import { Box } from '../Box'
import {
  BunnySlider,
  BarBackground,
  BarProgress,
  StyledInput,
  StyledSliderTooltip,
  StyledSliderTooltipText,
} from './styles'
import SliderProps from './types'

const Slider: React.FC<SliderProps> = ({
  name,
  min,
  max,
  value,
  valueLabel,
  onValueChanged,
  step = 'any',
  disabled = false,
  ...props
}) => {
  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    onValueChanged(parseFloat(target.value))
  }
  const containerRef = React.useRef<HTMLDivElement>()
  const ratio = value / max
  const progressPercentage = ratio * 100
  const isMax = value === max
  let tooltipOffsetX = 0

  if (containerRef.current) {
    const containerWidth = containerRef.current.offsetWidth - 18
    tooltipOffsetX = (value / max) * containerWidth - containerWidth / 2
  }

  const { tooltip, targetRef, tooltipVisible } = useTooltip(
    <StyledSliderTooltip>
      <StyledSliderTooltipText>{valueLabel}</StyledSliderTooltipText>
    </StyledSliderTooltip>,
    {
      placement: 'top',
      tooltipOffset: [tooltipOffsetX, 15],
      showArrow: false,
      CustomTooltipContainer: 'div',
    },
  )

  const progressWidth = `${progressPercentage}%`
  return (
    <Box position="relative" height="32px" {...props}>
      <BunnySlider ref={containerRef}>
        <BarBackground disabled={disabled} />
        <BarProgress style={{ width: progressWidth }} disabled={disabled} />
        {valueLabel && tooltipVisible && tooltip}
        <StyledInput
          ref={targetRef}
          name={name}
          type="range"
          min={min}
          max={max}
          value={value}
          step={step}
          onChange={handleChange}
          isMax={isMax}
          disabled={disabled}
        />
      </BunnySlider>
    </Box>
  )
}

export default Slider
