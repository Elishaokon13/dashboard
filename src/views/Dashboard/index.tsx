import React from 'react'
import { useWeb3React } from 'wagmiUtil'
import Page from 'views/Page'
import DividendData from './components/DividendData'
import PageTitle from 'components/PageTitle'

const Dashboard: React.FC = () => {
  const { account } = useWeb3React()

  return (
    <Page m={{ xs: '44px 0px', sm: '0px' }}>
      <PageTitle
        display={{ xs: 'block', sm: 'block' }}
        width="100%"
        title="Limitless Dashboard"
        subtitle="Collect your Limitless rewards now"
      />   
      <DividendData
        account={account}
      />
      <br />
      <br />
    </Page>
  )
}

export default Dashboard
