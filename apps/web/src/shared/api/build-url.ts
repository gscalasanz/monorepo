/** URL de un endpoint (port de `HttpService`: descarta params vacíos). */

export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Readonly<Record<string, QueryValue>>;

export interface UrlParts {
  readonly baseUrl: string;
  readonly endpoint: string;
  readonly params?: QueryParams;
}

function isPresent(
  entry: [string, QueryValue],
): entry is [string, string | number | boolean] {
  const [, value] = entry;
  return value !== undefined && value !== null && value !== '';
}

const OUTSIDE_BASE_ERROR =
  'El endpoint resuelve fuera de la URL base de la API.';

const DOT_SEGMENTS: readonly string[] = ['.', '..'];

/**
 * Defensa en profundidad (además de `pathSegment`): el endpoint no puede tener
 * segmentos `.`/`..` y la URL resuelta debe seguir bajo la base.
 */
function assertUnderBase(baseUrl: string, endpoint: string): void {
  const base = new URL(baseUrl);
  const resolved = new URL(
    endpoint === '' ? baseUrl : `${baseUrl}/${endpoint}`,
  );
  const basePath = base.pathname.replace(/\/+$/, '');
  const hasDotSegment = endpoint
    .split('/')
    .some((s) => DOT_SEGMENTS.includes(s));
  const insideBase =
    resolved.origin === base.origin &&
    (resolved.pathname === basePath ||
      resolved.pathname.startsWith(`${basePath}/`));
  if (hasDotSegment || !insideBase) throw new Error(OUTSIDE_BASE_ERROR);
}

export function buildUrl({ baseUrl, endpoint, params = {} }: UrlParts): string {
  const path = endpoint === '' ? baseUrl : `${baseUrl}/${endpoint}`;
  assertUnderBase(baseUrl, endpoint);
  const search = new URLSearchParams(
    Object.entries(params)
      .filter(isPresent)
      .map(([key, value]): [string, string] => [key, String(value)]),
  ).toString();
  return search === '' ? path : `${path}?${search}`;
}
