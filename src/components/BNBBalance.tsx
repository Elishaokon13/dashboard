import { TextProps } from 'uikit'
import React from 'react'
import BigNumber from 'bignumber.js'
import { useBNBStatePriceFixed } from 'state/global/hooks'
import styled from 'styled-components'
import Balance from './Balance'
import { baseColors } from 'uikit/theme/colors'

interface BNBBalanceProps extends TextProps {
  value: string | BigNumber
}

const StyledInlineWrapper = styled.span`
  display: inline-block;
`

const BNBBalance: React.FC<BNBBalanceProps> = ({ value }) => {
  const bnbPrice = useBNBStatePriceFixed()

  const earningsBusd = React.useMemo(() => {
    if (value && bnbPrice) {
      return Number(bnbPrice) * Number(value)
    }
    return 0
  }, [value, bnbPrice])

  if (earningsBusd <= 0) {
    return null
  }

  return (
    <StyledInlineWrapper>
      <Balance fontSize="14px" color={baseColors.limitlessBlue} decimals={2} value={earningsBusd} unit=" USD" />
    </StyledInlineWrapper>
  )
}

export default React.memo(BNBBalance)
