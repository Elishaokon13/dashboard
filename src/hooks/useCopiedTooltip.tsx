import React from 'react'
import styled from 'styled-components'

const CopiedTooltip = styled.div.attrs((props: { bottom: string; left: string }) => props)<{
  isTooltipDisplayed: boolean
}>`
  display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? 'inline-block' : 'none')};
  position: absolute;
  padding: 8px;
  z-index: 100;
  bottom: ${(props) => props.bottom ?? '-10px'};
  left: ${(props) => props.left ?? '0'};
  font-size: 12px;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.contrast};
  color: ${({ theme }) => theme.colors.invertedContrast};
  border-radius: 16px;
  opacity: 0.7;
  width: 100px;
`

const useCopiedTooltip = (msg: string, bottom?: string, left?: string): [JSX.Element, () => void] => {
  const [isTooltipDisplayed, setIsTooltipDisplayed] = React.useState<boolean>(false)
  const displayTooltip = React.useCallback(() => {
    setIsTooltipDisplayed(true)
    setTimeout(() => {
      setIsTooltipDisplayed(false)
    }, 1000)
  }, [])

  const myTooltip = (
    <CopiedTooltip bottom={bottom} left={left} isTooltipDisplayed={isTooltipDisplayed}>
      {msg}
    </CopiedTooltip>
  )

  return [myTooltip, displayTooltip]
}

export default useCopiedTooltip
