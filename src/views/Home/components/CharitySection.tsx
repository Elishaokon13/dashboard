import React from 'react'
import { Box, Button, Flex, Paper, Text } from 'uikit'
import SectionLayout, { SectionLayoutProps } from 'components/SectionLayout'
import { breakpointMap } from 'uikit/theme/base'
import { useTranslation } from 'contexts/Localization'
import bg from 'assets/homepage_backgroundshape_pink.png'
import paws from 'assets/paws.png'
import stcLogo from 'assets/stc-logo.png'
import Image from 'next/legacy/image'
import Ribbon from './shared/Ribbon'

const CharitySection: React.FC<SectionLayoutProps> = ({ ...props }) => {
  const { t } = useTranslation()

  return (
    <SectionLayout {...props} reverseCue background="limitlessHome" flexDirection="column" alignItems="center">
      <Paper background="background" maxWidth={breakpointMap.md} width="100%">
        <Flex flexDirection="row-reverse">
          <Flex padding={{ xs: '24px', md: '60px' }} flexDirection="column" alignItems="center" width="100%">
            <div>
              <Text fontSize="2.2em" fontWeight="500" color="secondaryDark">
                {t('Did you know?')}
              </Text>
              <Text fontSize="2em" color="primary" lineHeight={1.2}>
                {t('Charity is our DNA… and our wallet')}
              </Text>
              <br />
              <Text fontSize="1.1em" fontWeight="500">
                {t(
                  'Limitless believes in “doing well by doing good.” Through our Charity Wallet, we financially support nonprofit organizations chosen by our user community. In addition, we support noble causes through networking, mentoring, and other means. Past recipients include:',
                )}
              </Text>
              <Box mt="2em" mb="2em">
                <Box mr="1em" display="inline">
                  <Image src={paws} width={165} height={48} alt="image" />
                </Box>
                <Image src={stcLogo} width={346} height={70} alt="image" />
              </Box>
            </div>
            <Button
              external
              as="a"
              href="https://limitless.exchange/mission"
              width="250px"
              style={{ alignSelf: 'flex-start' }}
              shadow="0px 3px 26px #1a1a1a26;"
            >
              Learn about our mission
            </Button>
          </Flex>

          <Ribbon ribbon={bg} width={180} />
        </Flex>
      </Paper>
    </SectionLayout>
  )
}

export default CharitySection
