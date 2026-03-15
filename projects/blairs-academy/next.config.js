/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['assets.vercel.com', 'cdn.jsdelivr.net', 'raw.githubusercontent.com'],
  },
  // Enable SWC minification for better performance
  swcMinify: true,
};

module.exports = nextConfig;