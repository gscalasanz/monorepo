import type { NextConfig } from 'next';

/**
 * En Vercel (Services) el api vive en el mismo dominio bajo `/api` (`vercel.json` → rewrites),
 * así que sin `API_URL` explícita se usa la ruta relativa. Fuera de Vercel no hay default:
 * `shared/api/env.ts` falla rápido si falta.
 */
const VERCEL_SAME_ORIGIN_API_URL = '/api/v1';

function resolveApiUrl(): string | undefined {
  if (process.env.API_URL) return process.env.API_URL;
  return process.env.VERCEL ? VERCEL_SAME_ORIGIN_API_URL : undefined;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Inlinea `API_URL` en el bundle del cliente en build time (sin prefijo NEXT_PUBLIC_).
  env: {
    API_URL: resolveApiUrl(),
  },
};

export default nextConfig;
