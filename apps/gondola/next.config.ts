/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import path from 'node:path'

import type {NextConfig} from 'next'
import webpack from 'webpack'

// const {withSentryConfig} = require('@sentry/nextjs')

const nextConfig: NextConfig = {
  transpilePackages: [
    path.resolve(__dirname, '../../packages/standard'),
    path.resolve(__dirname, '../../packages/ui'),
    path.resolve(__dirname, '../../packages/util'),
    path.resolve(__dirname, '../../packages/connect'),
  ],
  env: {
    NEXT_PUBLIC_PORT: process.env['PORT'] ?? '',
    NEXT_PUBLIC_NODE_ENV: process.env['NODE_ENV'],
  },
  // suppress error where 'debug' module requires 'supports-color' module dynamically
  // @see https://share.cleanshot.com/dWSLnpnS
  experimental: {esmExternals: 'loose', appDir: true},
  reactStrictMode: true,
  rewrites: async () => ({
    beforeFiles: [
      // Proxy metrics requests to Posthog.
      // TODO: Where is this used? and rename to _posthog to be consistent with _sentry
      {source: '/_posthog/:p*', destination: 'https://app.posthog.com/:p*'},
    ],
    afterFiles: [],
    fallback: [],
  }),

  swcMinify: true,
  typescript: {ignoreBuildErrors: true},
  eslint: {ignoreDuringBuilds: true},
  webpack: (config) => {
    config.module.exprContextCritical = false
    config.module.unknownContextCritical = false
    config.module.rules.push({
      test: /\.node$/,
      use: [{loader: 'node-loader'}],
    })
    config.resolve.fallback = {
      fs: false,
      child_process: false, // Reference: https://stackoverflow.com/questions/54459442/module-not-found-error-cant-resolve-child-process-how-to-fix
      // For mongodb, Refs: https://stackoverflow.com/questions/54275069/module-not-found-error-cant-resolve-net-in-node-modules-stompjs-lib
      tls: false,
      net: false,
      dns: false,
    }
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp:
          /^(encoding|bson-ext|kerberos|@mongodb-js\/zstd|snappy|snappy\/package\.json|aws4|mongodb-client-encryption)$/,
      }),
    )
    return config
  },
  images: {},
  productionBrowserSourceMaps: true, // Let's see if this helps with Sentry... We are OSS anyways so doesn't matter too much if source code is "leaked" to client
}

export default nextConfig

// Sentry is the one causing appDir only setup to fail so it needs to be upgraded
// /**
//  * @type {import('next').NextConfig}
//  */
// module.exports = withSentryConfig(
//   {
//     ...nextConfig,
//     sentry: {
//       // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
//       // for client-side builds. (This will be the default starting in
//       // `@sentry/nextjs` version 8.0.0.) See
//       // https://webpack.js.org/configuration/devtool/ and
//       // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
//       // for more information.
//       hideSourceMaps: true,
//       tunnelRoute: '/_sentry',
//     },
//   },
//   {
//     // Additional config options for the Sentry Webpack plugin. Keep in mind that
//     // the following options are set automatically, and overriding them is not
//     // recommended:
//     //   release, url, org, project, authToken, configFile, stripPrefix,
//     //   urlPrefix, include, ignore

//     // setCommits: {auto: true},
//     silent: false, // true to suppresses all logs
//     // For all available options, see:
//     // https://github.com/getsentry/sentry-webpack-plugin#options.
//   },
// )