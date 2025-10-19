import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Ignore ESLint errors during production builds
    // (Generated Prisma files have many linting issues)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable type checking during builds (already checked in development)
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
