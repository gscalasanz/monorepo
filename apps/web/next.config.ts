import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Inlinea `API_URL` en el bundle del cliente en build time (sin prefijo NEXT_PUBLIC_).
  env: {
    API_URL: process.env.API_URL,
  },
};

export default nextConfig;
