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
};

export default nextConfig;
