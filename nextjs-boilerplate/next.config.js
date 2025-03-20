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
  },
};

module.exports = nextConfig;
