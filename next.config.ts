import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tailwind v4 is compiled by Turbopack's native loader (set up by create-next-app).
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Puppy photos are served from /public, so no remote image hosts are needed.
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
