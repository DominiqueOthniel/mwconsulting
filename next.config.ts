import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "*": [
      "./prisma/dev.db",
      "./prisma/schema.prisma",
      "./node_modules/.prisma/client/**/*",
    ],
  },
};

export default nextConfig;
