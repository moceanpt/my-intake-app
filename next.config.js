// next.config.js
const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config) => {
    // allow  import '@/…'
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
};