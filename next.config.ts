import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false,
      }
    }
    return config
  },
  devIndicators: {
    appIsrStatus: false, // don't show ISR status in the UI
  },
}

export default nextConfig
