import { withContentlayer } from "next-contentlayer"

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverActions: true,
    // typedRoutes: true
  }
}

// module.exports = nextConfig

export default withContentlayer(nextConfig)
