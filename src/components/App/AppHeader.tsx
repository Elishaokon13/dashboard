import React from 'react'
import styled from 'styled-components'
import { Text, Flex, Heading, IconButton, ArrowBackIcon, NotificationDot } from 'uikit'
import { useExpertModeManager } from 'state/user/hooks'
import GlobalSettings from 'components/Menu/GlobalSettings'
import Link from 'next/link'
import Transactions from './Transactions'
import QuestionHelper from '../QuestionHelper'

interface Props {
  title: string
  subtitle: string
  helper?: string
  backTo?: string
  noConfig?: boolean
  transactions?: boolean
}

const AppHeaderContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const AppHeader: React.FC<Props> = ({ title, subtitle, helper, backTo, noConfig = false, transactions = false }) => {
  const [expertMode] = useExpertModeManager()

  return (
    <AppHeaderContainer>
      <Flex alignItems="center" mr={noConfig ? 0 : '16px'}>
        {backTo && (
          <Link passHref href={backTo} legacyBehavior>
            <IconButton as="a">
              <ArrowBackIcon color="secondary" width="32px" />
            </IconButton>
          </Link>
        )}
        <Flex flexDirection="column">
          <Heading color="secondary" as="h2" mb="8px">
            {title}
          </Heading>
          <Flex alignItems="center">
            <Text color="secondary" fontSize="14px">
              {subtitle}
            </Text>
            {helper && <QuestionHelper text={helper} ml="4px" mt="2px" color="secondary" placement="top-start" />}
          </Flex>
        </Flex>
      </Flex>
      {!noConfig && (
        <Flex alignItems="center">
          <NotificationDot show={expertMode}>
            <GlobalSettings color="secondary" />
          </NotificationDot>
          {transactions && <Transactions />}
        </Flex>
      )}
    </AppHeaderContainer>
  );
}

export default React.memo(AppHeader)
