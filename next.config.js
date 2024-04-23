/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'foody-bucket.s3.ap-southeast-2.amazonaws.com',
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;
