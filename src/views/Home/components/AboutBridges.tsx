import React from 'react'
import {
  RaindropIcon,
  Flex,
  Paper,
  SvgProps,
  Text,
  PeopleIcon,
  WalletFilledIcon,
  LightbulbIcon,
  SwapHorizontalIcon,
  Button,
} from 'uikit'
import SectionLayout, { SectionLayoutProps } from 'components/SectionLayout'
import { breakpointMap } from 'uikit/theme/base'
import { useTranslation } from 'contexts/Localization'
import bg from 'assets/homepage_backgroundshape_green.png'
import bg2 from 'assets/img/token_backgroundshape_green_card.png'
import NextLink from 'next/link'
import { externalLinks } from 'utils/links'
import Ribbon from './shared/Ribbon'

const ReasonItem = ({ Icon, title, content }: { Icon: React.FC<SvgProps>; title: string; content: string }) => {
  return (
    <Flex>
      <Icon style={{ alignSelf: 'flex-start', marginRight: '1em' }} color="secondaryDark" width={32} />{' '}
      <Text fontSize="1.1em">
        <Text color="secondaryDark" bold>
          {title}
        </Text>
        <Text>{content}</Text>
      </Text>
    </Flex>
  )
}

const AboutLimitless: React.FC<SectionLayoutProps> = ({ ...props }) => {
  const { t } = useTranslation()

  return (
    <SectionLayout
      {...props}
      maxHeight="none"
      flexDirection="column"
      padding={{ xs: 0, sm: 24 }}
      alignItems="center"
      position="relative"
    >
      <Ribbon display="block" position="absolute" top={0} right={0} ribbon={bg} width={185} height={258} />
      <Ribbon
        display="block"
        position="absolute"
        transform="rotate(180deg)"
        bottom={0}
        left={0}
        ribbon={bg2}
        width={185}
        height={258}
      />
      <Paper my="48px" background="background" maxWidth={breakpointMap.md} width="100%" overflow="unset !important">
        <Flex padding={{ xs: '24px', md: '48px' }} flexDirection="column" alignItems="center" width="100%">
          <div>
            <Text fontSize="2.2em" fontWeight="500" color="secondaryDark">
              {t('Why Limitless?')}
            </Text>
            <br />
            <Text fontSize="1.1em">
              {t(
                'Our mission is to make the future of finance work for everyone. To do that, we empower token holders and project developers with information and capabilities that drive better decisions and that make participation in DeFi more accessible to all.',
              )}
            </Text>
            <br />
            <br />

            <ReasonItem
              Icon={SwapHorizontalIcon}
              title="The best swap possible"
              content="It's a simple fact: There are a lot of places to make a swap, but only one way to get the lowest price on it. That's why there's Limitless. We scour the world's leading chains and DEXes to find—and execute—the best swaps on your behalf, saving you both time and money."
            />
            <br />
            <ReasonItem
              Icon={RaindropIcon}
              title="Multiple liquidity sources"
              content="Limitless is way more than just a DeFi exchange. We connect you with the world's leading chains and exchanges to make it easier to swap… well, just about any token you can imagine."
            />
            <br />
            <ReasonItem
              Icon={LightbulbIcon}
              title="Deeper insights"
              content="Other aggregators simply facilitate the swap. Limitless facilitates better decision making with information about both a project and its token as well as how much money you can save by executing your swap with us versus anyone else."
            />
            <br />
            <ReasonItem
              Icon={WalletFilledIcon}
              title="Ramp equipped"
              content="From CEXes to DEXes and wallets to bank accounts, getting money in and out of DeFi can be difficult—to the point of discouraging participation. Limitless aims to change that. Our easy-to-use on/off-ramp capabilities enable you to use nothing more than a credit card to get in and out DeFi quickly, and easily."
            />
            <br />
            <ReasonItem
              Icon={PeopleIcon}
              title="Coming soon: Crowdsourced due diligence"
              content="Limitless is committed to safety, equity, and innovation, and we've turned these commitments into a suite of product capabilities that make it easier to learn about the tokens that you swap. Members of the Limitless community rate and review DeFi projects across a variety of indicators, helping you make the best decisions possible."
            />
          </div>
          <Flex flexWrap="wrap" alignSelf="flex-start" justifyContent="center" alignItems="center" mt="2em">
            <NextLink href="/swap" passHref legacyBehavior>
              <Button m="4px" shadow="0px 3px 26px #1a1a1a26;">
                Start swapping
              </Button>
            </NextLink>{' '}
            <Button
              m="4px"
              as="a"
              shadow="0px 3px 26px #1a1a1a26;"
              external
              href={externalLinks.learnSemiDefi}
              variant="secondaryLight"
            >
              Learn DeFi
            </Button>
          </Flex>
        </Flex>
      </Paper>
    </SectionLayout>
  );
}

export default AboutLimitless
