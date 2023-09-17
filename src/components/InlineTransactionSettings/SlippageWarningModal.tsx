import { Button, Modal, Text } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { memo } from 'react'

interface SlippageWarningModalProps {
  onDismiss?: () => void
  setSlippageConfirm: (confirm: boolean) => void
}

const SlippageWarningModal: React.FC<SlippageWarningModalProps> = ({ onDismiss, setSlippageConfirm }) => {
  const { t } = useTranslation()

  return (
    <Modal title={t('Slippage Warning')} hideCloseButton>
      <Text maxWidth="400px">
        {t(
          'Setting your slippage tolerance too high might leave you susceptible to paying more per token than you intended. We recommend that you only increase this when your transaction is not succeeding.',
        )}
      </Text>
      <Button
        mt="2em"
        onClick={() => {
          setSlippageConfirm(true)
          onDismiss()
        }}
        width="100%"
      >
        {t('I understand')}
      </Button>
    </Modal>
  )
}

export default memo(SlippageWarningModal)
