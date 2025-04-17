import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["kim-vinh-vuong.s3.ap-southeast-2.amazonaws.com"],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
