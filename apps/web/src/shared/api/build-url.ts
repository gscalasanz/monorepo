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

export function buildUrl({ baseUrl, endpoint, params = {} }: UrlParts): string {
  const path = endpoint === '' ? baseUrl : `${baseUrl}/${endpoint}`;
  const search = new URLSearchParams(
    Object.entries(params)
      .filter(isPresent)
      .map(([key, value]): [string, string] => [key, String(value)]),
  ).toString();
  return search === '' ? path : `${path}?${search}`;
}
