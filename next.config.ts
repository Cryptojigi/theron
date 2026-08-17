import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Proxy API calls to the backend running on 127.0.0.1:3001 (same VM) */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:3001/api/:path*",
      },
    ];
  },
  turbopack: {},
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;


