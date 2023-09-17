import { Button, Grid, Message, MessageText, Modal, } from 'uikit'
import { useActiveChainId, useLocalNetworkChain } from 'hooks/useActiveChainId'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { useNetwork } from 'wagmi'
import React, { useMemo } from 'react'
import { ChainId } from 'sdk'
import { useTranslation } from 'contexts/Localization'
import { CHAIN_ID } from 'utils/getRpcUrl'

// Where chain is not supported or page not supported
export function UnsupportedNetworkModal({ pageSupportedChains }: { pageSupportedChains?: number[] }) {
  const { switchNetworkAsync, isLoading, canSwitch } = useSwitchNetwork()
  const { chains } = useNetwork()
  const chainId = useLocalNetworkChain() || CHAIN_ID
  const { t } = useTranslation()

  const supportedMainnetChains = useMemo(
    () => chains.filter((chain) => !chain.testnet && pageSupportedChains?.includes(chain.id)),
    [chains, pageSupportedChains],
  )

  return (
    <Modal title={t('Check your network')} hideCloseButton headerBackground="gradientCardHeader">
      <Grid style={{ gap: '16px' }} maxWidth="336px">
        <Message variant="warning">
          <MessageText>
            {t('Currently this feature is only supported on Polygon chain. Please switch your network to continue.')}
          </MessageText>
        </Message>
        {canSwitch ? (
          <Button
            isLoading={isLoading}
            onClick={() => {
              if (supportedMainnetChains.map((c) => c.id).includes(chainId)) {
                switchNetworkAsync(chainId)
              } else {
                switchNetworkAsync(ChainId.BSC)
              }
            }}
          >
            {isLoading ? t('Switching network...') : t('Switch network')}
          </Button>
        ) : (
          <Message variant="danger">
            <MessageText>{t('Unable to switch network. Please try it on your wallet')}</MessageText>
          </Message>
        )}
        {/* {isConnected && (
          <Button
            variant="secondary"
            onClick={() =>
              logout().then(() => {
                switchNetworkLocal(CHAIN_ID)
              })
            }
          >
            {t('Disconnect Wallet')}
          </Button>
        )} */}
      </Grid>
    </Modal>
  )
}

const UnsupportedNetworkOverlay = ({ children }) => {
  const { chainId } = useActiveChainId()

  if (chainId && chainId !== ChainId.BSC) {
    return <UnsupportedNetworkModal />
  }

  return children
}

export default React.memo(UnsupportedNetworkOverlay)
