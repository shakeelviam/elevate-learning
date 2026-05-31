import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['ai.elev8-edu.com', 'localhost:3002'],
    },
  },
}

export default nextConfig
