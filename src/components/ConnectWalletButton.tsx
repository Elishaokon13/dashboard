import { Button, useWalletModal } from 'uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import Trans from './Trans'
import { useWeb3Modal } from '@web3modal/react'

const ConnectWalletButton = (props) => {
  //const { t } = useTranslation()
  //const { login, logout } = useAuth()
  //const { onPresentConnectModal } = useWalletModal(login, logout, t)
  const { open, close } = useWeb3Modal()

  return (
    <Button onClick={open} {...props}>
      <Trans>Connect Wallet</Trans>
    </Button>
  )
}

export default ConnectWalletButton
