/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["finnhub.io"],
  },
};

module.exports = nextConfig;
