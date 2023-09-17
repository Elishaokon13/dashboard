import React from 'react'
import { ModalBody, ModalHeader, ModalTitle, ModalContainer, ModalCloseButton, ModalBackButton } from './styles'
import { ModalProps } from './types'

const RewardsTitle = () => {
  return(
    <div style={{display: "flex", width: "175px"}}>
      <div style={{flex: 1}}>
        <img src="https://www.limitlessnetwork.org/_next/static/media/Logo.3a89c1e7.png?imwidth=3840" alt="logo" style={{height: "50px"}} />
      </div>
      <div style={{flex: 2, alignSelf: "center"}}>
        <div>
          <p style={{fontSize: "20px"}}>Limitless Rewards</p>
        </div>
      </div>
    </div>
  )
}

const Modal: React.FC<ModalProps> = ({
  title,
  subTitle,
  onDismiss,
  onBack,
  children,
  hideCloseButton = false,
  bodyPadding = '24px',
  minWidth = '320px',
  ...props
}) => {
  return (
    <ModalContainer minWidth={minWidth} {...props}>
      <ModalHeader>
        <ModalTitle>
          {onBack && <ModalBackButton onBack={onBack} />}
          <RewardsTitle/>
        </ModalTitle>
        {!hideCloseButton && <ModalCloseButton onDismiss={onDismiss} />}
      </ModalHeader>
      <ModalBody p={bodyPadding}>{children}</ModalBody>
    </ModalContainer>
  )
}

export default Modal
