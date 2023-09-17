import { InputHTMLAttributes } from 'react'
import styled, { DefaultTheme } from 'styled-components'
import Text from '../Text/Text'

interface SliderLabelProps {
  progress: string
}

interface StyledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isMax: boolean
  theme: DefaultTheme
}

interface DisabledProp {
  disabled?: boolean
}

const getCursorStyle = ({ disabled = false }: DisabledProp) => {
  return disabled ? 'not-allowed' : 'pointer'
}

const getBaseThumbStyles = ({ theme, disabled }: StyledInputProps) => `
-webkit-appearance: none;
background-color: #fff;
border-radius: 50%;
border: 2px solid ${theme.colors.secondary};
cursor: ${getCursorStyle};
width: 18px;
height: 18px;
margin-top: 3px;

transition: 200ms transform;
&:hover {
  transform: ${disabled ? 'none' : 'scale(1.3)'};
}
`

export const StyledSliderTooltip = styled.div`
  font-size: 12px;
  display: flex;
  background: unset;
  justify-content: center;
  align-items: center;
  padding: 0;
  width: 48px;
  height: 48px;
  border-radius: 50% 50% 50% 0;
  background-color: ${({ theme }) => theme.colors.secondary}eb;
  white-space: nowrap;
  transform: rotate(-45deg);
  color: ${({ theme }) => theme.colors.invertedContrast};
`

export const StyledSliderTooltipText = styled.div`
  transform: rotate(45deg);
`

export const SliderLabelContainer = styled.div`
  bottom: 0;
  position: absolute;
  left: 14px;
  width: calc(100% - 30px);
`

export const SliderLabel = styled(Text)<SliderLabelProps>`
  bottom: 0;
  font-size: 12px;
  left: ${({ progress }) => progress};
  position: absolute;
  text-align: center;
  min-width: 24px; // Slider thumb size
`

export const BunnySlider = styled.div`
  position: absolute;
  width: 100%;
`

export const StyledInput = styled.input<StyledInputProps>`
  cursor: ${getCursorStyle};
  height: 22px;
  margin: 0px;
  position: relative;

  ::-webkit-slider-thumb {
    ${getBaseThumbStyles}
  }

  ::-moz-range-thumb {
    ${getBaseThumbStyles}
  }

  ::-ms-thumb {
    ${getBaseThumbStyles}
  }
`

export const BarBackground = styled.div<DisabledProp>`
  background-color: ${({ theme, disabled }) => theme.colors[disabled ? 'textDisabled' : 'secondary']}40;
  height: 6px;
  position: absolute;
  top: 10px;
  width: 100%;
  border-radius: 12px;
  margin: 0px;
`

export const BarProgress = styled.div<DisabledProp>`
  background-color: ${({ theme }) => theme.colors.secondary};
  filter: ${({ disabled }) => (disabled ? 'grayscale(100%)' : 'none')};
  height: 6px;
  position: absolute;
  border-radius: 12px;
  top: 10px;
  margin: 0px;
`
