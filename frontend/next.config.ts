import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Use standalone output for AWS Amplify deployment
  output: "standalone",
};

export default nextConfig;
