/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
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

module.exports = withPWA(nextConfig)

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
