import React from 'react'
import { HelpIcon, useTooltip, Box, BoxProps, Placement } from 'uikit'
import styled from 'styled-components'

interface Props extends BoxProps {
  text: string | React.ReactNode
  placement?: Placement
  size?: string
  color?: string
}

const QuestionWrapper = styled.div`
  :hover,
  :focus {
    opacity: 0.7;
  }
`

const QuestionHelper: React.FC<Props> = ({
  text,
  placement = 'right-end',
  size = '16px',
  color = 'text',
  ...props
}) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(text, {
    placement,
    trigger: 'hover',
    tooltipOffset: placement === 'top-start' ? [-14, 10] : undefined,
  })

  return (
    <Box mt="2px" {...props}>
      {tooltipVisible && tooltip}
      <QuestionWrapper ref={targetRef}>
        <HelpIcon color={color} width={size} />
      </QuestionWrapper>
    </Box>
  )
}

export default React.memo(QuestionHelper)
