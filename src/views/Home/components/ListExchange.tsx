import React from 'react'
import { Button, Paper, CardBody, Flex, Heading, Text, OpenNewIcon, FlexItem } from 'uikit'
import SectionLayout, { SectionLayoutProps } from 'components/SectionLayout'
import { TranslateFunction, useTranslation } from 'contexts/Localization'
import Image, { StaticImageData } from 'next/image'
import announcement from 'assets/img/annoucement.png'
import code from 'assets/img/code.png'
import bot from 'assets/img/bot.png'
import CheckListItem from 'components/CheckListItem'

interface ListExchangeCard {
  Icon: StaticImageData
  checkboxes: string[]
  name: string
  link: string
  t: TranslateFunction
  btnText: string
}

const ListExchangeCard: React.FC<ListExchangeCard> = ({ Icon, checkboxes, name, link, t, btnText }) => {
  return (
    <Paper maxWidth={{ md: '280px' }} padding="24px" height={{ xs: 'auto', sm: '400px', md: '450px' }}>
      <Flex alignItems="center" justifyContent="center" flexDirection="column" height="100%">
        <Image src={Icon} width={80} height={80} alt="icon" />
        <br />
        <Heading textAlign="center">{name}</Heading>
        <br />
        <Text fontSize="0.9em" mt="0.5em" textAlign="left" style={{ flexGrow: 1 }}>
          {checkboxes.map((text) => (
            <CheckListItem alignItems="center" mb="0.5em" checked descriptionText={text} key={text} />
          ))}
        </Text>
        <Button as="a" href={link} external startIcon={<OpenNewIcon />} variant="primary" my="1rem">
          {t(btnText)}
        </Button>
      </Flex>
    </Paper>
  )
}

const ListExchange: React.FC<SectionLayoutProps> = (props) => {
  const { t } = useTranslation()
  return (
    <SectionLayout
      {...props}
      background="limitlessGrad3"
      alignItems="center"
      maxHeight="auto"
      pt="50px"
      justifyContent="center"
      flexDirection="column"
    >
      <Flex px="24px" pb="100px" flexDirection="column" alignItems="center">
        <Text fontSize="2.2em" fontWeight="500" color="primary" lineHeight={1.2} textAlign="center">
          {t('Packages for Projects')}
        </Text>
        <br />
        <Text fontSize="1.1 em" maxWidth="400px" textAlign="center" color="text">
          {t(' Let us help you maximize the reach for your project')}
        </Text>
      </Flex>

      <Flex container spacing="36px">
        <FlexItem xs={12} sm={6} md={4}>
          <ListExchangeCard
            t={t}
            checkboxes={[
              'Advertise on our exchange homepage',
              'Work with us for tailored social media packages',
              'Advertise using our custom buy/sell bot',
            ]}
            name="Tailored Marketing"
            Icon={announcement}
            link="/contact"
            btnText="Contact us"
          />
        </FlexItem>
        <FlexItem xs={12} sm={6} md={4}>
          <ListExchangeCard
            t={t}
            checkboxes={['Custom smart contracts', 'Custom exchange integration', 'Services tailored to you']}
            name="Technology as a service"
            Icon={code}
            link="/contact"
            btnText="Contact us"
          />
        </FlexItem>
        <FlexItem xs={12} sm={6} md={4}>
          <ListExchangeCard
            t={t}
            checkboxes={[
              'Show buys/sells of your token and/or other currencies',
              'Easy set up or set up as a service available',
              'Display in local currencies',
            ]}
            name="Custom Buy Bot"
            Icon={bot}
            link="/contact"
            btnText="Contact us"
          />
        </FlexItem>
      </Flex>
    </SectionLayout>
  )
}

export default ListExchange
