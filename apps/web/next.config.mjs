import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@gin/shared", "@evefrontier/dapp-kit"],
  outputFileTracingRoot: path.join(import.meta.dirname, "../..")
};

export default nextConfig;
