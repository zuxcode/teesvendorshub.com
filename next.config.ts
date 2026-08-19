import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    localPatterns: [
      {
        pathname: "/api/media/file/**",
      },
    ],
    qualities: [50, 75, 100],
    remotePatterns: [
      {
        hostname: "admin.teesvendorshub.com",
        pathname: "/assets/**",
        protocol: "https",
      },
      {
        hostname: "teesvendorshub.com",
        pathname: "/**",
        protocol: "https",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };

    return webpackConfig;
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
