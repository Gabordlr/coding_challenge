import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbo if it causes issues
  experimental: {
    turbo: false,
  },
  // Ensure SWC is used instead of Turbo
  swcMinify: true,
};

export default nextConfig;
