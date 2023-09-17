import React from 'react'
import styled from 'styled-components'
import { SpinnerProps } from './types'
import LimitlessIcon from './LimitlessIcon'

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`

const Spinner: React.FC<SpinnerProps> = () => {
  return (
    <Container>
      <LimitlessIcon />
    </Container>
  )
}

export default Spinner
