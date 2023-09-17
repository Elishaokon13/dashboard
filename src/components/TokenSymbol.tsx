import { Skeleton } from 'uikit'
import { useToken } from '../hooks/Tokens'

type TokenSymbolProps = {
  address: string
}
const TokenSymbol = ({ address }: TokenSymbolProps) => {
  const token = useToken(address)
  return <span>{token?.symbol || <Skeleton display="inline-block" as="span" width="50px" />}</span>
}

export default TokenSymbol
