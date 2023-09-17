import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Button, Text } from 'uikit'
import { setupNetwork } from 'utils/wallet'
import { useWeb3React } from 'wagmiUtil'
import { InjectedConnector } from '@web3-react/injected-connector'

interface WalletWrongNetworkProps {
  onDismiss: () => void
}

const WalletWrongNetwork: React.FC<WalletWrongNetworkProps> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { connector } = useWeb3React()

  const handleSwitchNetwork = async (): Promise<void> => {
    await setupNetwork()
    onDismiss()
  }

  return (
    <>
      <Text mb="24px">{t('You’re connected to the wrong network.')}</Text>
      {connector instanceof InjectedConnector && (
        <Button onClick={handleSwitchNetwork} mb="24px">
          {t('Switch Network')}
        </Button>
      )}
    </>
  )
}

export default WalletWrongNetwork
