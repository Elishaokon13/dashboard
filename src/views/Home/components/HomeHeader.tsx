import React from 'react'
import { Box, Button, Flex, FlexItem, Text } from 'uikit'
import SectionLayout, { SectionLayoutProps } from 'components/SectionLayout'
import { breakpointMap } from 'uikit/theme/base'
import NextLink from 'next/link'
import Image from 'next/legacy/image'
import homelogo from 'assets/512xfloating.gif'
import { InfoLinksCarousel } from 'components/LinksCarousel'
import TempBanner from 'components/TempBanner'

const HomeHeader: React.FC<SectionLayoutProps> = ({ ...props }) => {
  return (
    <SectionLayout
      {...props}
      cueBottomPos="100px"
      background="bridgesHome"
      flexDirection="column"
      padding={0}
      minHeight={{ xs: 'auto', md: '700px' }}
      height={{ xs: '100%', md: '100vh' }}
      alignItems="center"
    >
      <Box
        width="100%"
        padding="0px 8px"
        paddingBottom="0px"
        marginTop={{ xs: '100px', md: '0px' }}
        height="100%"
        position="relative"
        px={{ xs: '12px', sm: '24px' }}
        maxWidth={breakpointMap.xxl}
      >
        <TempBanner />
        <Flex container width="100%" minHeight="500px" height="100%">
          <FlexItem xs={12} md={5} display="flex" justifyContent="center" flexDirection="column">
            <Text
              color="primary"
              textAlign={{ xs: 'center', md: 'left' }}
              fontSize={{ xs: '3em', md: '4em' }}
              lineHeight="1.1"
              mb="5px"
              fontWeight="500"
            >
              Poodl Exchange
            </Text>
            <Text
              textAlign={{ xs: 'center', md: 'left' }}
              color="text"
              fontSize={{ xs: '1.4em', md: '1.4em' }}
              lineHeight="1.5"
              fontWeight="100"
              mb="2rem"
            >
              Scanning DeFi for the best swap.
            </Text>

            <Flex
              flexWrap="wrap"
              alignItems={{ xs: 'center', md: 'flex-start' }}
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              flexDirection={{ xs: 'row', md: 'column' }}
            >
              <NextLink href="/swap" passHref legacyBehavior>
                <Button m="10 5px" shadow="0px 3px 26px #1a1a1a26;">
                  Swap now
                </Button>
              </NextLink>{' '}
            </Flex>
          </FlexItem>
          <FlexItem xs={12} md={7} display="flex" alignItems="flex-end">
            <Flex
              alignItems="center"
              justifyContent="center"
              maxWidth="600px"
              margin="0px auto"
              marginTop="30px"
              width="100%"
              height="100"
              position="relative"
            >
              <Image width={700} height={700} src={homelogo} priority objectFit="contain" alt="Home Splash Art" />
            </Flex>
          </FlexItem>
        </Flex>
      </Box>
      <InfoLinksCarousel />
    </SectionLayout>
  )
}

export default HomeHeader
