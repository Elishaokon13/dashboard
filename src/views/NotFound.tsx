import styled from 'styled-components'
import { Button, Heading, Text } from 'uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import Link from 'next/link'
import Image from 'next/image'
import Logo from 'assets/limitlesslogo.png'

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  justify-content: center;
`

const NotFound = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <StyledNotFound>
        <Image src={Logo} alt="Logo" width={118} height={65} />
        <Heading scale="xxl">404</Heading>
        <Text mb="16px">{t('Oops, page not found.')}</Text>
        <Link href="/" passHref legacyBehavior>
          <Button as="a" scale="sm">
            {t('Home')}
          </Button>
        </Link>
      </StyledNotFound>
    </Page>
  )
}

export default NotFound
