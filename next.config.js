/* eslint-disable @typescript-eslint/no-var-requires */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: false,
  cacheOnFrontEndNav: true,
  disable: process.env.NODE_ENV === 'development',
  publicExcludes: [
    '!images/**/*',
    '!locales/**/*',
    '!android-chrome-512x512.png',
    '!android-chrome-192x192.png',
    '!favicon-180x180.png',
  ],
})

const { withAxiom } = require('next-axiom')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  reactStrictMode: false,
  env: {
    nomicsApiKey: '',
    googleAnalytics: '',
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/transaction',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
    ]
  },
}

const withTM = require('next-transpile-modules')(['@poodl/widget']);

module.exports = (_phase) => {
  const plugins = [withBundleAnalyzer, withPWA, withAxiom, withTM]
  const config = plugins.reduce((acc, plugin) => plugin(acc), {
    ...nextConfig,
  })
  return config
}
