import { connectorLocalStorageKey, ConnectorNames } from 'uikit'
import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import {
  ConnectorNotFoundError,
  SwitchChainError,
  SwitchChainNotSupportedError,
  useConnect,
  useDisconnect,
  useNetwork,
} from 'wagmi'
import replaceBrowserHistory from 'utils/replaceBrowserHistory'
import { useTranslation } from 'contexts/Localization'
import { clearUserStates } from '../utils/clearUserStates'
import { useActiveChainId } from './useActiveChainId'
import { useSessionChainId } from './useSessionChainId'

const useAuth = () => {
  const dispatch = useAppDispatch()
  const { connectAsync, connectors } = useConnect()
  const { chain } = useNetwork()
  const { disconnectAsync } = useDisconnect()
  const { chainId } = useActiveChainId()
  const [, setSessionChainId] = useSessionChainId()
  const { t } = useTranslation()

  const login = useCallback(
    // eslint-disable-next-line consistent-return
    async (connectorID: ConnectorNames, showError = true) => {
      const findConnector = connectors.find((c) => c.id.toLowerCase() === connectorID.toLowerCase())
      try {
        const connected = await connectAsync({ connector: findConnector, chainId })
        if (!connected.chain.unsupported && connected.chain.id !== chainId) {
          replaceBrowserHistory('chainId', connected.chain.id)
          setSessionChainId(connected.chain.id)
        }
        return connected
      } catch (error) {
        if (showError) {
          window?.localStorage?.removeItem(connectorLocalStorageKey)

          if (error instanceof ConnectorNotFoundError) {
            throw new Error('Connector not found')
          }
          if (error instanceof SwitchChainNotSupportedError || error instanceof SwitchChainError) {
            throw new Error(t('Unable to switch network. Please try it on your wallet'))
          }
        }
      }
    },
    [connectors, connectAsync, chainId, setSessionChainId, t],
  )

  const logout = useCallback(async () => {
    try {
      await disconnectAsync()
    } catch (error) {
      console.error(error)
    } finally {
      clearUserStates(dispatch, { chainId: chain?.id, isDeactive: true })
    }
  }, [disconnectAsync, dispatch, chain?.id])

  return { login, logout }
}

export default useAuth
