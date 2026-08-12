import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["maplibre-gl", "react-map-gl"],
};

export default nextConfig;
