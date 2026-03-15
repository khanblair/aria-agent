/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // If you ever serve remote icons, list the domains here.
    domains: [],
  },
  // Defensive fallback for any future env vars.
  env: {
    NEXT_PUBLIC_API_BASE:
      process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3000/api",
  },
  // Enable SWC minification for better performance.
  swcMinify: true,
};

module.exports = nextConfig;