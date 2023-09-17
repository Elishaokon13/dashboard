import React from 'react'
import { Box, LimitlessGreenIcon, Button, ExchangeIcon, Flex, FlexItem, LiquidityIcon, SvgProps, Text } from 'uikit'
import SectionLayout, { SectionLayoutProps } from 'components/SectionLayout'
import NextLink from 'next/link'
import { useTranslation } from 'contexts/Localization'
import { externalLinks } from 'utils/links'

interface ProductCardProps {
  Icon: React.FC<SvgProps>
  summary: string
  link: string
  btnText: string
  btnLink: string
}

const ProductCard: React.FC<ProductCardProps> = ({ Icon, summary, link, btnText, btnLink }) => {
  return (
    <Flex alignItems="center" justifyContent="flex-start" flexDirection="column" height="100%">
      <Flex maxWidth={{ xs: '380px', md: 'auto' }} m="5px" flexDirection={{ xs: 'row', md: 'column' }}>
        <Icon width="75px" color="secondary" />
        <Text
          m="25px"
          fontWeight="500"
          fontSize="18px"
          lineHeight={1.2}
          textAlign={{ md: 'center' }}
          style={{ flexGrow: 1 }}
        >
          {summary}
        </Text>
      </Flex>

      <Flex flexDirection={{ xs: 'row', md: 'column' }}>
        <NextLink href={btnLink} passHref legacyBehavior>
          <Button
            width={{ xs: '170px', md: '190px' }}
            as="a"
            mr="1em"
            mb="1em"
            variant="primary"
            shadow="0px 3px 26px #1a1a1a26;"
          >
            {btnText}
          </Button>
        </NextLink>
        <Button
          width={{ xs: 'auto', md: '190px' }}
          as="a"
          href={link}
          external
          variant="secondaryLight"
          shadow="0px 3px 26px #1a1a1a26;"
        >
          Learn more
        </Button>
      </Flex>
    </Flex>
  );
}

const ProductSection: React.FC<SectionLayoutProps> = ({ ...props }) => {
  const { t } = useTranslation()

  return (
    <SectionLayout {...props} flexDirection="column" alignItems="center" paddingTop="75px">
      <Flex container spacing="20px">
        <FlexItem xs={12} md={4}>
          <Box width={{ md: '250px' }} height="100%">
            <ProductCard
              summary={t('Swap between Limitless-approved tokens')}
              Icon={ExchangeIcon}
              link={externalLinks.learnSwap}
              btnLink="/swap"
              btnText="Swap"
            />
          </Box>
        </FlexItem>
        <FlexItem xs={12} md={4}>
          <Box width={{ md: '290px' }} height="100%">
            <ProductCard
              summary={t('Provide liquidity for trading pairs and earn 0.25% on each transaction')}
              Icon={LiquidityIcon}
              link={externalLinks.learnLiquidity}
              btnLink="/liquidity"
              btnText="Provide liquidity"
            />
          </Box>
        </FlexItem>

        <FlexItem xs={12} md={4}>
          <Box width={{ md: '300px' }} height="100%">
            <ProductCard
              summary={t('Farm your liquidity and earn our native token as well as the dividends it pays')}
              Icon={LimitlessGreenIcon}
              link={externalLinks.learnFarm}
              btnLink="/farms"
              btnText="Farm"
            />
          </Box>
        </FlexItem>
      </Flex>
    </SectionLayout>
  )
}

export default ProductSection
