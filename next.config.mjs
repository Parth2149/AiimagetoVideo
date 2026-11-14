/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Support up to 50MB uploads for video files
  experimental: {
    serverActions: {
      bodySizeLimit: '60mb',
    },
  },
};

export default nextConfig;

