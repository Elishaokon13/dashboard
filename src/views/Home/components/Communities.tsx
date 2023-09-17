import React from 'react'
import {
  Button,
  Paper,
  CardBody,
  Flex,
  Heading,
  Text,
  OpenNewIcon,
  SvgProps,
  TelegramIcon,
} from 'uikit'
import { externalLinks } from 'utils/links'
import SectionLayout, { SectionLayoutProps } from 'components/SectionLayout'
import styled from 'styled-components'
import { TranslateFunction, useTranslation } from 'contexts/Localization'

const StyledRoundIcon = styled.div<{ color: string }>`
  padding: 14px;
  border-radius: 100%;
  height: 68px;
  width: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme, color }) => theme.colors[color]};
`

interface CommunityCard {
  Icon: React.FC<SvgProps>
  summary: string
  name: string
  link: string
  t: TranslateFunction
  btnText: string
}

const CommunityCard: React.FC<CommunityCard> = ({ Icon, summary, name, link, t, btnText }) => {
  return (
    <Paper maxWidth={{ md: '280px' }}>
      <CardBody>
        <Flex alignItems="center" justifyContent="center" flexDirection="column">
          <StyledRoundIcon color="secondary">
            <Icon width="38px" color="white" />
          </StyledRoundIcon>
          <br />
          <Heading>{name}</Heading>
          <br />
          <Text textAlign="center" color="textSecondary">
            {t(summary)}
          </Text>
          <br />
          <br />
          <Button as="a" href={link} external startIcon={<OpenNewIcon />} variant="primary">
            {t(btnText)}
          </Button>
        </Flex>
      </CardBody>
    </Paper>
  )
}

const Communities: React.FC<SectionLayoutProps> = (props) => {
  const { t } = useTranslation()
  return (
    <SectionLayout
      {...props}
      background="limitlessHome"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Heading scale="xl" textAlign="center" fontWeight="500" color="secondary">
        {t('Join the Limitless Community')}
      </Heading>
      <br />
      <Text maxWidth="450px" textAlign="center" mb={{ xs: '24px', lg: '120px' }}>
        {t(
          'Meet your fellow holders, innovators, and crypto enthusiasts by joining all of our international online communities.',
        )}
      </Text>


      <CommunityCard
        t={t}
        summary="Jump into the chat on our Telegram, and join our announcement channel."
        name="Telegram"
        Icon={TelegramIcon}
        link={externalLinks.telegramgroup}
        btnText="Join the chat"
      />

    </SectionLayout>
  )
}

export default Communities
