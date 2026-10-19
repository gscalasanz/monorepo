/**
 * Base URL de la API desde `API_URL`, validada al cargar el módulo
 * (fail fast: sin URL válida la app no arranca con requests a `undefined/...`).
 * Next inlinea `process.env.API_URL` en build vía `env` de next.config: el acceso debe ser literal.
 */
import { z } from 'zod';

const TRAILING_SLASHES = /\/+$/;
const ENV_ERROR =
  'API_URL inválida o ausente: debe ser una URL http(s) (ver .env.example).';

const apiUrlSchema = z
  .string()
  .url()
  .refine((value) => /^https?:\/\//.test(value));

export function parseApiBaseUrl(raw: unknown): string {
  const result = apiUrlSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(ENV_ERROR);
  }
  return result.data.replace(TRAILING_SLASHES, '');
}

export const API_BASE_URL = parseApiBaseUrl(process.env.API_URL);
