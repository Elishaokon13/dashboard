import { Skeleton } from 'uikit'
import { useToken } from '../hooks/Tokens'

type TokenNameProps = {
  address: string
}
const TokenName = ({ address }: TokenNameProps) => {
  const token = useToken(address)
  return <span>{token?.name || <Skeleton display="inline-block" as="span" width="100px" />}</span>
}

export default TokenName
