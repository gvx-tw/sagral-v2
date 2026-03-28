import type { NextConfig } from 'next'
import withPWA from '@ducanh2912/next-pwa'

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
  async redirects() {
    return [
      { source: '/index.html',    destination: '/',         permanent: true },
      { source: '/catalogo.html', destination: '/catalogo', permanent: true },
      { source: '/login.html',    destination: '/admin',    permanent: true },
      { source: '/admin.html',    destination: '/admin',    permanent: true },
    ]
  },
}

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  workboxOptions: {
    disableDevLogs: true,
  },
})(nextConfig)