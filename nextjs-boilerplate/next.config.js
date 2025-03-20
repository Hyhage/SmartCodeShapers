/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable CORS for API routes
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },
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
