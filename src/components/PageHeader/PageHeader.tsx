import React from 'react'
import styled from 'styled-components'
import { Box } from 'uikit'
import Container from '../Layout/Container'
import { PageHeaderProps } from './types'

const Outer = styled(Box)<{ background?: string }>`
  background: ${({ background }) => background || 'transparent'};
`

const Inner = styled(Container)`
  padding-top: 32px;
  padding-bottom: 32px;
`

const PageHeader: React.FC<PageHeaderProps> = ({ background, children, ...props }) => (
  <Outer background={background} {...props}>
    <Inner>{children}</Inner>
  </Outer>
)

export default PageHeader
