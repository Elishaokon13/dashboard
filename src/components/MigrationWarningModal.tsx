import { Button, Modal, Text, useModal } from 'uikit'
import { memo, useEffect } from 'react'

interface MigrationWarningModalProps {
    onDismiss?: () => void
}

const MigrationWarnningModal: React.FC<MigrationWarningModalProps> = ({ onDismiss }) => {

    return (
        <Modal title="Limitless Migration Warning" hideCloseButton>
            <Text maxWidth="400px">
                The Limitless project is currently undergoing a migration, joining forces with the Limitless Network team following the recent community poll results.
                <ul>
                    <li>Do not buy limitless token</li>
                    <li>Do not deposit liqudiity</li>
                    <li>Do not stake your tokens</li>
                    <li>Do not farm</li>
                    <li>Join our telegram to learn more.</li>
                </ul>
            </Text>
            <Button
                mt="2em"
                onClick={onDismiss}
                width="100%"
            >
                Confirm
            </Button>
        </Modal>
    )
}

export default memo(MigrationWarnningModal)


export const ShowMigrationWarningModal = () => {

    const [onOpen] = useModal(
        <MigrationWarnningModal />,
        false,
    )

    useEffect(() => {
        onOpen()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return null
}
