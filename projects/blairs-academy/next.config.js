/** @type {import('next').NextConfig} */
const { NEXT_PUBLIC_API_URL } = process.env;

module.exports = {
  reactStrictMode: true,
  // Provide a safe fallback for the env variable
  env: {
    NEXT_PUBLIC_API_URL: NEXT_PUBLIC_API_URL ?? '',
  },
  images: {
    domains: ['assets.vercel.com'],
  },
};