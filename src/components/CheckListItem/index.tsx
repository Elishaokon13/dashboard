import React from 'react'
import { CheckmarkCircleFillIcon, Flex, FlexProps, Text } from 'uikit'

interface CheckListItemProps extends FlexProps {
  descriptionText: string
  checked?: boolean
}

const CheckListItem: React.FC<CheckListItemProps> = ({ descriptionText, checked = true, ...props }) => {
  return (
    <Flex mb="0.875em" {...props}>
      <CheckmarkCircleFillIcon width="1.5em" color="secondaryDark" mr="1em" opacity={checked ? '1' : '0.2'} />
      <Text textAlign="left">{descriptionText}</Text>
    </Flex>
  )
}
export default CheckListItem
