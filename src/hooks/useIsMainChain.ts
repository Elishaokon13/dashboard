import { CHAIN_ID } from 'utils/getRpcUrl'
import { useActiveChainId } from './useActiveChainId'

const useIsMainChain = () => {
  const { chainId } = useActiveChainId()
  return chainId === CHAIN_ID
}

export default useIsMainChain
