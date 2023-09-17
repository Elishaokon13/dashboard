import Page from 'views/Page'
import PageTitle from 'components/PageTitle'
import {Flex, FlexItem } from 'uikit'
import { PoodlApp } from '@poodl/widget';
import useWindowDimensions from 'hooks/useWindowDimensions';

const SwapTitle = () => {
  return(
    <Flex width="100%" maxWidth={{ xs: '145px', md: '175px' }}>
    <div style={{display: "flex"}}>
      <div style={{flex: 1}}>
        <img src="https://www.limitlessnetwork.org/_next/static/media/Logo.3a89c1e7.png?imwidth=3840" alt="logo" style={{height: "45px"}} />
      </div>
      <div style={{flex: 2, alignSelf: "center"}}>
        <div>
          <p style={{fontSize: "18px"}}>Limitless Swap</p>
        </div>
      </div>
    </div>
  </Flex>
  )
}

const handleTokenSelect = (outputToken) => {    
  console.log(outputToken.symbol)
}

const SwapWidget = () => {
  return(
    <>
      <PoodlApp
        onTokenSelect={handleTokenSelect}
        primaryColorDark='#2196f3'
        borderRadius={5}
        enableDarkMode={true}   
        predefinedTokens={[
            {
                address: "0xC13CbF50370E5EaE6f5Dd9D8a1015007f34C4eaD",
                chainId: 56,
                decimals: 18,
                hasTransactonFees: true,
                logoURI: "https://www.limitlessnetwork.org/_next/static/media/Logo.3a89c1e7.png?imwidth=3840",
                name: "Limitless Network",
                symbol: "LNT"
            }
        ]}
        defaultPinnedTokens={{
            56: [
                "0xC13CbF50370E5EaE6f5Dd9D8a1015007f34C4eaD",
                "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
            ]
        }}
        defaultSelectedTokenByChains={{
            56: {
                defaultOutputToken: "0xC13CbF50370E5EaE6f5Dd9D8a1015007f34C4eaD"
            }
        }}
        overrides={{
          SwapCard: {
            sx: {
              backgroundColor: '#000000',
              borderColor: 'secondary.main',
              minWidth: '100%'
            }
          },
          SwapCardTitle: <SwapTitle/>
        }}  
      />
    </>
  )
}

const Chart = () => {
  return(
    <>
    <iframe width="100%" height="850" src="https://coinbrain.com/embed/bnb-0xc13cbf50370e5eae6f5dd9d8a1015007f34c4ead?theme=custom&accent=2196f3&padding=16&background=000000&chart=1&trades=1"></iframe>
    </>
  )
}

const Stats = () => {
  const { width } = useWindowDimensions();
  const statsHeight = (): string => {
    if (width < 852){
      return '500px'
    } {
      return "100%"
    }
  }
  const widgetHeight = statsHeight()

  return(
    <>
    <iframe width="100%" height={widgetHeight}  src="https://coinbrain.com/coins/bnb-0xc13cbf50370e5eae6f5dd9d8a1015007f34c4ead/ticker?theme=custom&accent=2196f3&background=000000&padding=16&type=large&currency=USD&blocks=price%2CmarketCap%2Cvolume24h%2Cliquidity"></iframe>
    </>
  )
}

const Swap = () => {
  return (
    <Page m={{ xs: '44px 0px', sm: '0px' }}>
      <PageTitle
        display={{ xs: 'block', sm: 'block' }}
        width="100%"
        title="Limitless Swap"
        subtitle="Get the best prices in DeFi right here with Limitless"
      />   
      <br />
      <br />

      <Flex container spacing="24px" width="100%" maxWidth={{ xs: '500px', md: '950px' }}>
        <FlexItem xs={12} md={6}>         
          <SwapWidget />
        </FlexItem>

        <FlexItem xs={12} md={6}>
          <Stats/>
        </FlexItem>       

      </Flex>
      <br />
      <br />
      <br />
    </Page>    
  )
}

export default Swap
