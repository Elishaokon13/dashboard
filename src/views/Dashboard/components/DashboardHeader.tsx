import React from 'react'
import { Text } from 'uikit'

const DashboardHeader: React.FC<{ text: string }> = ({ text }) => {
  return (
    <Text fontSize="20px" mb="10px" bold color="text">
      {text}
    </Text>
  )
}

export default DashboardHeader
