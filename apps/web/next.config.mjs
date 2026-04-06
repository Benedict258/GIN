import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@gin/shared", "@evefrontier/dapp-kit"],
  outputFileTracingRoot: path.join(import.meta.dirname, "../.."),
  env: {
    VITE_EVE_WORLD_PACKAGE_ID:
      process.env.NEXT_PUBLIC_WORLD_PACKAGE_ID ?? process.env.WORLD_PACKAGE_ID ?? "",
    VITE_OBJECT_ID:
      process.env.NEXT_PUBLIC_EVE_FRONTIER_ITEM_ID ?? process.env.EVE_FRONTIER_ITEM_ID ?? ""
  }
};

export default nextConfig;
