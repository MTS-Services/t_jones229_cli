import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // matches any hostname
      },
      {
        protocol: "http",
        hostname: "**", // for non-HTTPS images (if needed)
      },
    ],
  },
  // Optimize build for Docker/limited memory environments
  experimental: {
    webpackBuildWorker: true,
  },
  // Reduce memory usage during build
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Optimize memory usage
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    };

    return config;
  },
  // Output settings for better production builds
  output: 'standalone',
  // Compress output
  compress: true,
  // Production source maps for debugging (disable to save memory)
  productionBrowserSourceMaps: false,
};

export default nextConfig;
