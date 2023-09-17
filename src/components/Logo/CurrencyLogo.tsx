import { Currency } from 'sdk'
import React from 'react'
import styled from 'styled-components'
import { useToken } from 'hooks/Tokens'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from './Logo'

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  max-width: fit-content;
  border-radius: 100%;
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const wrappedCurrency = (useToken(currency?.address) || currency) as WrappedTokenInfo
  const srcs = React.useMemo(
    () =>
      wrappedCurrency?.tokenInfo?.logoURI
        ? [wrappedCurrency?.tokenInfo?.logoURI]
        : [`/images/tokens/${wrappedCurrency?.symbol}.png`],
    [wrappedCurrency?.symbol, wrappedCurrency?.tokenInfo?.logoURI],
  )
  // if (currency === ETHER[chainId]) {
  //   return <BinanceIcon width={size} style={style} />
  // }
  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
