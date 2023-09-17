import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import LimitlessNetwork from 'assets/LimitlessNetwork.png'
import Text from '../Text/Text'
import Skeleton from '../Skeleton/Skeleton'
import { Colors } from '../../theme'

export interface Props {
  color?: keyof Colors
  cakePriceUsd?: number | string
  showLogo: boolean
}

const PriceLink = styled.a`
  display: flex;
  align-items: center;
  svg {
    transition: transform 0.3s;
  }
  :hover {
    svg {
      transform: scale(1.2);
    }
  }
`

const CakePrice: React.FC<Props> = ({ cakePriceUsd, color = 'textSubtle', showLogo = true }) => {
  return cakePriceUsd ? (
    <PriceLink href="https://app.limitlessnetwork.org/swap" target="_blank">
      {showLogo && <Image src={LimitlessNetwork} width={24} height={28} alt="Limitless Network Token" />}
      <Text color={color} bold ml="0.5rem">
        ${cakePriceUsd}
      </Text>
    </PriceLink>
  ) : (
    <Skeleton width={80} height={24} />
  )
}

export default React.memo(CakePrice)
