import type { NextConfig } from "next";

const isVercelBuild = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  // Vercel runs the application with Next.js instead of the Cloudflare Worker
  // runtime used by Vinext. Keep Cloudflare bindings importable during the
  // Vercel build; API routes return their existing "not connected" responses
  // when those bindings are unavailable.
  ...(isVercelBuild
    ? {
        turbopack: {
          resolveAlias: {
            "cloudflare:workers": "./lib/cloudflare-workers-shim.ts",
          },
        },
      }
    : {}),
};

export default nextConfig;
