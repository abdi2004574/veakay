/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['recharts', '@tanstack/react-query', 'react-table'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          recharts: {
            name: 'recharts',
            test: /[\\/]node_modules[\\/]recharts[\\/]/,
            priority: 20,
            chunks: 'all',
          },
          tanstackQuery: {
            name: 'tanstack-query',
            test: /[\\/]node_modules[\\/]@tanstack[\\/]react-query[\\/]/,
            priority: 20,
            chunks: 'all',
          },
          reactTable: {
            name: 'react-table',
            test: /[\\/]node_modules[\\/]react-table[\\/]/,
            priority: 20,
            chunks: 'all',
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 10,
            chunks: 'all',
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
