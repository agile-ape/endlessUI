/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en-US', 'zh-CN'],
    defaultLocale: 'en-US',
  },
  webpack: (config) => {
    // config.resolve.fallback = { fs: false, net: false, tls: false }
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development',
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/whitelist',
  //       permanent: false,
  //     },
  //   ]
  // },
}

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})

module.exports = nextConfig

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dn4hm5vfh/',
      },
    ],
  },
}
