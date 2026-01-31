/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.britannica.com',
      },
      {
        protocol: 'https',
        hostname: 'dygtyjqp7pi0m.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'www.woldswildlife.co.uk',
      },
    ],
  },
};

module.exports = nextConfig;
