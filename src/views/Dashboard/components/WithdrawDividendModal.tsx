import { Button, Modal, Text } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { memo } from 'react'
import { ModalActions } from 'components/Modal'

interface WithdrawDividendModalProps {
  onDismiss?: () => void
  onConfirm: () => void
}

const WithdrawDividendModal: React.FC<WithdrawDividendModalProps> = ({ onDismiss, onConfirm }) => {
  const { t } = useTranslation()

  return (
    <Modal title={t('')} hideCloseButton>
      <Text maxWidth="300px">
        {t(
          'Are you sure you want to collect your Limitless rewards now? If so, click "Collect Now" and pay the gas fee to collect. Otherwise click "Cancel" to go back to the dashboard.',
        )}
      </Text>

      <ModalActions>
        <Button variant="secondary" onClick={onDismiss} width="100%">
          {t('Cancel')}
        </Button>
        <Button
          onClick={() => {
            onConfirm()
            onDismiss()
          }}
          width="100%"
        >
          {t('Collect Now')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default memo(WithdrawDividendModal)
