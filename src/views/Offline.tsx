import styled from 'styled-components'
import { Heading } from 'uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import Image from 'next/image'
import Logo from 'assets/limitlesslogo.png'

const StyledOffline = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  justify-content: center;
`


const Offline = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <StyledOffline>
        <Image src={Logo} alt="Logo" width={118} height={65} />
        <Heading scale="xxl">{t('You are offline.')}</Heading>
        <Heading scale="lg">{t('Please connect to the internet')}</Heading>
        <br />
        <br />
      </StyledOffline>
    </Page>
  )
}

export default Offline
