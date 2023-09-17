import React, { cloneElement, Children, ReactElement } from 'react'
import styled from 'styled-components'
import Flex from '../Box/Flex'
import { TabMenuProps } from './types'

const Wrapper = styled(Flex)`
  overflow-x: scroll;
  width: 100%;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`

const Inner = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  flex-grow: 1;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-grow: 0;
  }
`

const ButtonMenu: React.FC<TabMenuProps> = ({ activeIndex = 0, onItemClick, children }) => {
  return (
    <Wrapper>
      <Inner>
        {Children.map(children, (child: ReactElement, index) => {
          if (!child) {
            return null
          }
          const isActive = activeIndex === index
          return cloneElement(child, {
            isActive,
            onClick: onItemClick ? () => onItemClick(index) : undefined,
            backgroundColor: "background",
            border: isActive ? 'background' : "1px solid red",
          })
        })}
      </Inner>
    </Wrapper>
  )
}

export default ButtonMenu
