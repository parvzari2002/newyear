/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'picsum.photos'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle sql.js for server-side
      config.externals = [...(config.externals || []), 'sql.js']
    }
    return config
  },
}

module.exports = nextConfig

