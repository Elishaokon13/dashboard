import React from 'react'
import styled from 'styled-components'
import { Text, Flex, Modal, InjectedModalProps } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import GasSettings from './GasSettings'

const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  max-height: 400px;
  ${({ theme }) => theme.mediaQueries.sm} {
    max-height: none;
  }
`

const SettingsModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const { t } = useTranslation()

  return (
    <Modal title={t('Settings')} onDismiss={onDismiss} style={{ maxWidth: '420px' }}>
      <ScrollableContainer>
        <Flex pb="24px" flexDirection="column">
          <Text bold textTransform="uppercase" fontSize="12px" color="secondary" mb="24px">
            {t('Global')}
          </Text>
          <GasSettings />
        </Flex>
      </ScrollableContainer>
    </Modal>
  )
}

export default SettingsModal
