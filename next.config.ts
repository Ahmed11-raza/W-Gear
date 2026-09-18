import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 430, 768, 1024, 1280, 1440, 1920, 2560],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
