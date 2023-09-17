import React from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'

const variants = {
  hidden: { opacity: 0, x: -30, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
}

const transition = { type: 'linear' }

const StyledMotionDiv = styled(motion.div)`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const AnimateLayout: React.FC = ({ children }) => {
  return (
    <StyledMotionDiv initial="hidden" animate="enter" exit="exit" variants={variants} transition={transition}>
      {children}
    </StyledMotionDiv>
  )
}

export default AnimateLayout
