import { Skeleton } from 'uikit'
import useBusdPrice from 'hooks/useBUSDPrice'
import React from 'react'
import { useToken } from '../hooks/Tokens'

type TokenUSDProps = {
  address: string
}
const TokenUSD = ({ address }: TokenUSDProps) => {
  const token = useToken(address)

  const busdPrice = useBusdPrice(token)

  return (
    <span>
      {busdPrice && token ? busdPrice.toSignificant() : <Skeleton display="inline-block" as="span" width="50px" />}
    </span>
  )
}

export default React.memo(TokenUSD)
