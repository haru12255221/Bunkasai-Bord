import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('async_hooks');
    }
    return config;
  },
};

export default nextConfig;