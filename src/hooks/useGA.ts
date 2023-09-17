/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRouter } from 'next/router'
import React from 'react'

export const pageview = (url: URL) => {
  // window.gtag('config', process.env.googleAnalytics, {
  //   page_path: url,
  // })
}

export const consentGA = () => {
  // window.gtag('js', new Date())
  // pageview(new URL(window.location.href))
  // window.gtag('consent', 'update', {
  //   analytics_storage: 'granted',
  // })
}

type GTagEvent = {
  action?: string
  params?: Record<string, unknown>
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const gaEvent = ({ action = 'click', params = {} }: GTagEvent) => {
  // window.gtag('event', action, params)
}

const useGA = () => {
  // const router = useRouter()
  // React.useEffect(() => {
  //   const isProduction = true || process.env.NODE_ENV === 'production'
  //   if (isProduction) {
  //     const handleRouteChange = (url: URL) => {
  //       pageview(url)
  //     }
  //     // When the component is mounted, subscribe to router changes
  //     // and log those page views
  //     router.events.on('routeChangeComplete', handleRouteChange)
  //     // If the component is unmounted, unsubscribe
  //     // from the event with the `off` method
  //     return () => {
  //       router.events.off('routeChangeComplete', handleRouteChange)
  //     }
  //   }
  // }, [router.events])
}

export default useGA
