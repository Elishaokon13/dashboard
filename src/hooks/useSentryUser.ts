import useActiveWeb3React from './useActiveWeb3React'

function useSentryUser() {
  const { account } = useActiveWeb3React()
  return account
}

export default useSentryUser
