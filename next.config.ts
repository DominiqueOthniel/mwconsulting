import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  outputFileTracingIncludes: {
    "*": [
      "./prisma/dev.db",
      "./prisma/schema.prisma",
      "./node_modules/.prisma/client/**/*",
    ],
  },
};

export default nextConfig;
