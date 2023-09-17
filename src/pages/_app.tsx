import { ResetCSS } from 'uikit'
import BigNumber from 'bignumber.js'
import { ToastListener } from 'contexts/ToastsContext'
import useEagerConnect from 'hooks/useEagerConnect'
import { useAccountEventListener } from 'hooks/useAccountEventListener'
import useUserAgent from 'hooks/useUserAgent'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import React, { Fragment } from 'react'
import { PersistGate, PersistGateProps } from 'redux-persist/integration/react'
import { useStore, persistor } from 'state'
import { NextPage } from 'next'
import { AnimatePresence } from 'framer-motion'
import NProgress from 'nprogress'
import SingletonRouter from 'next/router'
import TermOfUseModal from 'components/TermOfUseModal'
import Menu from '../components/Menu'
import Providers from '../Providers'
import GlobalStyle from '../style/Global'
import useSW from '../hooks/useSW'
import TokenUsdPriceUpdater from 'components/TokenUsdPriceUpdater'
// eslint-disable-next-line camelcase
import { Roboto } from 'next/font/google'

const noto = Roboto({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
})
export { reportWebVitals } from 'next-axiom'

let timeout: NodeJS.Timeout | undefined
SingletonRouter.events.on('routeChangeStart', () => {
  // show loading indicator if page transition is over 200ms
  timeout = setTimeout(() => {
    NProgress.start()
  }, 200)
})
const whenFinishLoad = () => {
  if (timeout) clearTimeout(timeout)
  NProgress.done()
}
SingletonRouter.events.on('routeChangeComplete', whenFinishLoad)
SingletonRouter.events.on('routeChangeError', whenFinishLoad)

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

function GlobalHooks() {
  useEagerConnect()

  useUserAgent()
  useAccountEventListener()
  useSW()
  return null
}
function MyApp(props: AppProps) {
  const { pageProps, router } = props
  const store = useStore(pageProps.initialReduxState)
  const url = `https://limitlessnetwork.org${router.route}`
  const pageTitle = 'Limitless Network - Save Money and Time with DeFi Liquidity Aggregation'
  const pageDescription =
    'Limitless Network aggregates DeFi liquidity, providing the best swaps with low fees. Save money and time with our ecosystem token, integration technology, and expert developer support.'

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#111213" />

        <meta name="application-name" content="Limitless Network" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Limitless Network" />
        <meta name="description" content={pageDescription} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        <meta property="og:title" content={pageTitle} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content="Limitless Network" />

        <title>{pageTitle}</title>
      </Head>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx global>{`
        html {
          font-family: ${noto.style.fontFamily};
        }
      `}</style>
      <Providers store={store}>
        <GlobalHooks />
        <ResetCSS />
        <TokenUsdPriceUpdater />
        <GlobalStyle />
        <App {...props} />
      </Providers>
    </>
  )
}

type NextPageWithLayout = NextPage & {
  Layout?: React.FC
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

class ServerSidePersistGate extends React.Component<PersistGateProps> {
  render() {
    return this.props.children
  }
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  let MyPersistGate = ServerSidePersistGate
  if (process.env.RUNTIME === 'browser') {
    MyPersistGate = PersistGate
  }
  // Use the layout defined at the page level, if available
  const Layout = Component.Layout || Fragment
  return (
    <>
      <MyPersistGate loading={null} persistor={persistor}>
        <Menu>
            <AnimatePresence exitBeforeEnter initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </AnimatePresence>
        </Menu>
      </MyPersistGate>
      <ToastListener />
    </>
  )
}

export default MyApp
