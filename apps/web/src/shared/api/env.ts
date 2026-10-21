/**
 * Base URL de la API desde `API_URL`, validada al cargar el módulo
 * (fail fast: sin URL válida la app no arranca con requests a `undefined/...`).
 * Acepta una URL http(s) absoluta (api en otro host) o una ruta del mismo origen
 * (`/api/v1`, cuando Vercel Services enruta `/api` al api en el mismo dominio).
 * Next inlinea `process.env.API_URL` en build vía `env` de next.config: el acceso debe ser literal.
 */
import { z } from 'zod';

const TRAILING_SLASHES = /\/+$/;
const ENV_ERROR =
  'API_URL inválida o ausente: debe ser una URL http(s) o una ruta que empiece con "/" (ver .env.example).';

const ABSOLUTE_HTTP_URL = /^https?:\/\//;
/** `/algo`, pero no `//host` ni `/\host` (el navegador los resuelve a otro origen). */
const SAME_ORIGIN_PATH = /^\/(?![/\\])/;

const absoluteUrlSchema = z
  .string()
  .url()
  .refine((value) => ABSOLUTE_HTTP_URL.test(value));
const sameOriginPathSchema = z.string().regex(SAME_ORIGIN_PATH);

const apiUrlSchema = z.union([absoluteUrlSchema, sameOriginPathSchema]);

export function parseApiBaseUrl(raw: unknown): string {
  const result = apiUrlSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(ENV_ERROR);
  }
  return result.data.replace(TRAILING_SLASHES, '');
}

export const API_BASE_URL = parseApiBaseUrl(process.env.API_URL);
