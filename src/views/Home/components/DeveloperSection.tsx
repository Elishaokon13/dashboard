import React from 'react'
import { Button, Flex, Text } from 'uikit'
import SectionLayout, { SectionLayoutProps } from 'components/SectionLayout'
import { useTranslation } from 'contexts/Localization'
import { externalLinks } from 'utils/links'

const DeveloperSection: React.FC<SectionLayoutProps> = ({ ...props }) => {
  const { t } = useTranslation()

  return (
    <SectionLayout
      {...props}
      flexDirection="column"
      paddingTop="100px"
      paddingBottom="75px"
      alignItems="center"
      position="relative"
    >
      <Flex overflow="unset !important" alignItems="center" justifyContent="center" flexDirection="column">
        <Text textAlign="center" color="secondary" fontSize="2em" lineHeight={1.2}>
          {t('Are you a crypto pioneer and need a place to shine?')}
        </Text>
        <br />
        <Text textAlign="center" fontSize="1.2em" lineHeight={1.2} fontWeight="500">
          {t('Jump on board; the listing is free. View our pitch deck and documentation for more information.')}
        </Text>
        <br />
        <Flex position="absolute" bottom="-30px" flexWrap="wrap" justifyContent="center" alignItems="center" zIndex={1}>
          <Button as="a" external href="https://wru6uj38gcq.typeform.com/to/wKgwe9v8 " width="200px">
            Submit a project
          </Button>
          <Button as="a" external href={externalLinks.learnListing} m="10px" variant="secondaryLight">
            Listing requirements
          </Button>
        </Flex>
      </Flex>
    </SectionLayout>
  )
}

export default DeveloperSection
