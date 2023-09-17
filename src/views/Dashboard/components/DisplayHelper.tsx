import React from 'react'
import QuestionHelper from 'components/QuestionHelper'
import { Text, Flex, Skeleton } from 'uikit'

const DisplayHelper: React.FC<{
  tooltip?: string
  label: string
  loading?: boolean
  withMarginTop?: boolean
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize'
}> = ({ tooltip, label, children, loading, textTransform = 'uppercase', withMarginTop = true }) => {
  return (
    <>
      <Flex alignItems="center" mt={withMarginTop ? '0.5em' : undefined}>
        <Text mr="0.5em" textTransform={textTransform} fontSize="12px" color="text" bold>
          {label}
        </Text>
        {tooltip && <QuestionHelper color="secondary" placement="top-start" text={tooltip} />}
      </Flex>
      <Text fontSize="20px" color="text">{loading ? <Skeleton height="30px" width="10ch" /> : children}</Text>
    </>
  )
}

export default DisplayHelper
