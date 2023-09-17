import React from 'react'
import { Box, Button, Flex, FlexItem, Paper, Text } from 'uikit'
import SectionLayout, { SectionLayoutProps } from 'components/SectionLayout'
import NextLink from 'next/link'
import { useTranslation } from 'contexts/Localization'
import { Pagination, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import bridgehand from 'assets/poodl_bag.png'
import exchange from 'assets/wallet.png'
import rocket from 'assets/rocket.png'
import onramp from 'assets/money.png'
import code from 'assets/code_2.png'
import Image from 'next/legacy/image'
import CheckListItem from 'components/CheckListItem'
import Logo from 'assets/limitlesslogo.png'

// eslint-disable-next-line import/no-unresolved
import 'swiper/css'
// eslint-disable-next-line import/no-unresolved
import 'swiper/css/navigation'
// eslint-disable-next-line import/no-unresolved
import 'swiper/css/pagination'
import styled from 'styled-components'
import { externalLinks } from 'utils/links'

interface CardContainerProps {
  title: string
  subtitle: string
  checkboxes: string[]
  img: React.ReactNode
  btn1: React.ReactNode
  btn2: React.ReactNode
}

const CardContainer: React.FC<CardContainerProps> = React.memo(({ title, subtitle, checkboxes, img, btn1, btn2 }) => {
  return (
    <Paper p={{ xs: '24px', md: '40px' }} width="100%" m={{ xs: '24px', sm: '70px' }} mb="50px !important">
      <Text textAlign="left" color="text">
        <Flex container flexDirection="row" spacing="24px">
          <FlexItem xs={12} sm={5} justifyContent="center" alignItems="flex-start" display="flex">
            <Flex
              width="80%"
              height="200px"
              justifyContent="center"
              alignItems="center"
              display="flex"
              position="relative"
            >
              {img}
            </Flex>
          </FlexItem>
          <FlexItem xs={12} sm={7}>
            <Text fontSize="1.5em" lineHeight="1.1" color="text">
              {title}
            </Text>
            <Text fontSize="1em">{subtitle}</Text>
            <Text fontSize="0.9em" mt="1.2em" textAlign="left">
              {checkboxes.map((text) => (
                <CheckListItem alignItems="center" mb="0.5em" checked descriptionText={text} key={text} />
              ))}
            </Text>
            <Flex justifyContent={{ xs: 'center', md: 'center' }} mr="1.5rem" mt="2rem">
              <Box>{btn1}</Box>
            </Flex>
          </FlexItem>
        </Flex>
      </Text>
    </Paper>
  )
})
CardContainer.displayName = 'CardContainer'

const StyledSwiperContainer = styled.div`
  & .swiper-pagination-bullet {
    width: 16px;
    height: 16px;
    border: 6px solid ${({ theme }) => theme.colors.text};
    opacity: 1;
  }
  & .swiper-pagination-bullet-active {
    border: 6px solid ${({ theme }) => theme.colors.primary};
  }

  & .swiper-slide {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
  }

  & .swiper-button-next:after,
  .swiper-button-prev:after {
    font-size: 24px;
    font-weight: bolder;
    display: none;
    color: ${({ theme }) => theme.colors.text};
    ${({ theme }) => theme.mediaQueries.sm} {
      display: block;
    }
  }

  max-width: 770px;
  width: 100%;
  min-height: 70px;
  display: flex;
  justify-content: center;
`

const EcosystemSection: React.FC<SectionLayoutProps> = ({ ...props }) => {
  const { t } = useTranslation()

  return (
    <SectionLayout {...props} p="0px" py="70px" background="limitlessGrad2" flexDirection="column" alignItems="center">
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        maxWidth="950px"
        width="100%"
        position="relative"
      >
        <Flex px="24px" flexDirection="column" alignItems="center">
          <Text fontSize="2.2em" fontWeight="500" color="primary" lineHeight={1.2} textAlign="center">
            {t('What do we offer?')}
          </Text>
          <br />
          <Text fontSize="1.1 em" maxWidth="400px" textAlign="center" color="text">
            {t('Browse our utilities and services for both users and projects alike')}
          </Text>
        </Flex>
        <StyledSwiperContainer>
          <Swiper
            pagination={{
              clickable: true,
            }}
            navigation
            modules={[Pagination, Navigation]}
          >
            <SwiperSlide>
              <CardContainer
                title="The Fastest Aggregator"
                subtitle="Get the Best Swaps with Low Fees"
                checkboxes={[
                  'Lightning-fast trades with minimal slippage',
                  'Advanced algorithm finds the best swap',
                  'Low fees, transparent pricing',
                ]}
                img={<Image src={exchange} layout="fill" objectFit="contain" alt="card image" />}
                btn1={
                  <NextLink href="/swap" passHref legacyBehavior>
                    <Button>Swap now</Button>
                  </NextLink>
                }
                btn2={
                  <Button variant="secondaryLight" href={externalLinks.learnSwap} as="a" external>
                    Learn how
                  </Button>
                }
              />
            </SwiperSlide>
            <SwiperSlide>
              <CardContainer
                title="PET Token on Polygon"
                subtitle="Our high dividend paying token"
                checkboxes={[
                  'Earn a % of the aggregator and token volume just by holding',
                  'Payout in native MATIC on Polygon',
                  'Part of a powerful ecosystem ',
                ]}
                img={<Image src={Logo} layout="fill" objectFit="contain" alt="card image" />}
                btn1={
                  <NextLink href="/swap" passHref legacyBehavior>
                    <Button>Buy PET</Button>
                  </NextLink>
                }
                btn2={
                  <Button variant="secondaryLight" as="a" external href={externalLinks.learnLimitless}>
                    Learn more
                  </Button>
                }
              />
            </SwiperSlide>
            <SwiperSlide>
              <CardContainer
                title="Our tech your project!"
                subtitle="Integrate Our Tech for Powerful Results"
                checkboxes={['Few lines of code', 'Fully branded to your project', 'Earn on your own volume']}
                img={<Image src={code} layout="fill" objectFit="contain" alt="card image" />}
                btn1={
                  <Button as="a" external href={externalLinks.developerDocumentation}>
                    Check it out
                  </Button>
                }
                btn2={
                  <Button as="a" external href={externalLinks.learnReferral} variant="secondaryLight">
                    DeFi Glossary
                  </Button>
                }
              />
            </SwiperSlide>
            <SwiperSlide>
              <CardContainer
                title="Get listed with us!"
                subtitle="Stop pasting addresses"
                checkboxes={[
                  'Improve ease of buying for your community and new buyers',
                  'Benefit from our custom packages',
                  'Contact us for details and opportunities!',
                ]}
                img={<Image src={rocket} layout="fill" objectFit="contain" alt="card image" />}
                btn1={
                  <NextLink href="/contact" passHref legacyBehavior>
                    <Button>Contact Us</Button>
                  </NextLink>
                }
                btn2={
                  <Button variant="secondaryLight" as="a" external href={externalLinks.glossary}>
                    DeFi Glossary
                  </Button>
                }
              />
            </SwiperSlide>
            <SwiperSlide>
              <CardContainer
                title="FIAT on and off ramp"
                subtitle="Buy sell and withdraw from and to FIAT"
                checkboxes={[
                  'Multiple payment methods',
                  'Licensed in most countries',
                  'Mutliple currencies, with very low fees',
                ]}
                img={<Image src={onramp} layout="fill" objectFit="contain" alt="card image" />}
                btn1={
                  <NextLink href="/" passHref legacyBehavior>
                    <Button variant="secondaryLight">Coming soon</Button>
                  </NextLink>
                }
                btn2={
                  <Button variant="secondaryLight" as="a" external href={externalLinks.learnBuyRamp}>
                    Learn how
                  </Button>
                }
              />
            </SwiperSlide>
          </Swiper>
        </StyledSwiperContainer>
      </Flex>
    </SectionLayout>
  )
}

export default EcosystemSection
