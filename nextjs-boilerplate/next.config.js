/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configure paths
  images: {
    domains: [],
  },
  // Environment variables
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000/api',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  },
  // API configuration in experimental
  experimental: {
    serverComponentsExternalPackages: ['formidable'],
  },
};

module.exports = nextConfig;
