/**
 * Capa más interna del cliente: un `fetch` y su traducción a `ApiError`.
 * Nunca traga errores: red → `network` (status 0), ≥400 → `http` con el body de
 * NestJS, body ilegible → `contract`. Un abort del caller se propaga intacto.
 */
import { ApiError } from '@/shared/api/api-error';
import type { HttpMethod } from '@/shared/api/retry';

export type ResponseType = 'json' | 'blob' | 'text';

export interface TransportRequest {
  readonly method: HttpMethod;
  readonly url: string;
  readonly headers: Readonly<Record<string, string>>;
  readonly body?: unknown;
  readonly responseType: ResponseType;
  readonly signal?: AbortSignal;
}

const NETWORK_ERROR_STATUS = 0;
const JSON_CONTENT_TYPE = 'application/json';

/** Duck-typed: el `DOMException` de abort no siempre hereda del `Error` del realm actual. */
export function isAbortError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'AbortError'
  );
}

function errorFor(
  request: TransportRequest,
  init: { kind: ApiError['kind']; status: number; body?: unknown },
): ApiError {
  return new ApiError({ ...init, method: request.method, url: request.url });
}

function parseJson(text: string): unknown {
  return text === '' ? undefined : JSON.parse(text);
}

async function readErrorBody(response: Response): Promise<unknown> {
  const text = await response.text();
  try {
    return parseJson(text);
  } catch {
    return text;
  }
}

async function readBody(
  response: Response,
  request: TransportRequest,
): Promise<unknown> {
  if (request.responseType === 'blob') return response.blob();
  const text = await response.text();
  if (request.responseType === 'text') return text;
  try {
    return parseJson(text);
  } catch {
    throw errorFor(request, {
      kind: 'contract',
      status: response.status,
      body: text,
    });
  }
}

function toInit(request: TransportRequest): RequestInit {
  const hasBody = request.body !== undefined;
  return {
    method: request.method,
    headers: hasBody
      ? { 'Content-Type': JSON_CONTENT_TYPE, ...request.headers }
      : request.headers,
    body: hasBody ? JSON.stringify(request.body) : undefined,
    signal: request.signal,
  };
}

async function fetchOrNetworkError(
  fetchFn: typeof fetch,
  request: TransportRequest,
): Promise<Response> {
  try {
    return await fetchFn(request.url, toInit(request));
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw errorFor(request, { kind: 'network', status: NETWORK_ERROR_STATUS });
  }
}

export async function sendRequest(
  fetchFn: typeof fetch,
  request: TransportRequest,
): Promise<unknown> {
  const response = await fetchOrNetworkError(fetchFn, request);
  if (!response.ok) {
    const body = await readErrorBody(response);
    throw errorFor(request, { kind: 'http', status: response.status, body });
  }
  return readBody(response, request);
}
