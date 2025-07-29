// next.config.js
const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  // Optimize Fast Refresh
  reactStrictMode: true,
  
  // Fast Refresh settings
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
  
  webpack: (config, { dev, isServer }) => {
    // allow  import '@/…'
    config.resolve.alias['@'] = path.resolve(__dirname);
    
    // Optimize Fast Refresh
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    
    // Better Fast Refresh for development
    if (dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            default: false,
            vendors: false,
            // Create a vendor chunk for better caching
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Create a common chunk for shared code
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }
    
    return config;
  },
};