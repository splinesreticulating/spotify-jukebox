import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false, // don't show ISR status in the UI
  },
}

export default nextConfig
