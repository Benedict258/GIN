import path from "node:path";

const viteEnv = {
  VITE_EVE_WORLD_PACKAGE_ID:
    process.env.VITE_EVE_WORLD_PACKAGE_ID ??
    process.env.NEXT_PUBLIC_WORLD_PACKAGE_ID ??
    process.env.WORLD_PACKAGE_ID ??
    "",
  VITE_OBJECT_ID:
    process.env.VITE_OBJECT_ID ??
    process.env.NEXT_PUBLIC_EVE_FRONTIER_ITEM_ID ??
    process.env.EVE_FRONTIER_ITEM_ID ??
    ""
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@gin/shared", "@evefrontier/dapp-kit"],
  outputFileTracingRoot: path.join(import.meta.dirname, "../.."),
  env: {
    VITE_EVE_WORLD_PACKAGE_ID: viteEnv.VITE_EVE_WORLD_PACKAGE_ID,
    VITE_OBJECT_ID: viteEnv.VITE_OBJECT_ID
  },
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        "import.meta.env": JSON.stringify(viteEnv),
        "import.meta.env.VITE_EVE_WORLD_PACKAGE_ID": JSON.stringify(viteEnv.VITE_EVE_WORLD_PACKAGE_ID),
        "import.meta.env.VITE_OBJECT_ID": JSON.stringify(viteEnv.VITE_OBJECT_ID)
      })
    );

    return config;
  }
};

export default nextConfig;
