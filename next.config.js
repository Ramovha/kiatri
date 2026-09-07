/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // static export can't use the Next.js image optimizer
  },
};

module.exports = nextConfig;
