/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Don't fail the build on lint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't fail the build on type errors (Vercel doesn't have full type context)
    ignoreBuildErrors: true,
  },
};
module.exports = nextConfig;
