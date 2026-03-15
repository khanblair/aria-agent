/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Defensive fallback for any future env variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? '',
  },
  images: {
    // Allow external icons if needed
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;