import React from 'react'
import Page from 'views/Page'
import HomeHeader from './components/HomeHeader'
import EcosystemSection from './components/EcosystemSection'
import ListExchange from './components/ListExchange'

const Home: React.FC = () => {
  return (
    <Page removePadding removePaddingTop>
      <HomeHeader id="home-header" />
      <EcosystemSection id="eco-section" />
      <ListExchange id="list-exchange" nextSectionId="home-header" reverseCue />
    </Page>
  )
}

export default Home
