import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Le HTML autonome de la cap table est lu au runtime par la route API :
  // il faut l'inclure explicitement dans le bundle serverless (Vercel).
  outputFileTracingIncludes: {
    "/api/captable": ["./src/lib/captable.html"],
  },
};

export default nextConfig;
