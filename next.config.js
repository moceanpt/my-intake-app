/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Prevent build cache corruption
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Disable webpack caching in development to prevent corruption
      config.cache = false;
      
      // Ensure consistent module resolution
      config.resolve.symlinks = false;
      
      // Prevent module ID conflicts
      config.optimization = {
        ...config.optimization,
        moduleIds: 'named',
        chunkIds: 'named'
      };
    }
    
    return config;
  },
  
  // Clear build cache on each start
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  
  // Environment variables
  env: {
    NEXT_CACHE_DISABLED: 'true'
  }
}

module.exports = nextConfig