/**
 * Error tipado de la API + extracción del mensaje para el usuario (port de
 * `ErrorHandlerService`). NestJS responde `{ statusCode, message, error? }`, con
 * `message` string o string[] (class-validator).
 */
import { API_ERROR_COPY, HTTP_STATUS_MESSAGES } from '@/shared/api/copy';

/** `http`: el server respondió ≥400 · `network`: no hubo respuesta (status 0) · `contract`: respuesta con forma inesperada. */
export type ApiErrorKind = 'http' | 'network' | 'contract';

/** Un problema de forma en la respuesta (`kind: 'contract'`), sacado de zod. */
export interface ContractIssue {
  /** Ruta con puntos (`'1.id'`), `''` si es la raíz. */
  readonly path: string;
  readonly message: string;
}

export interface ApiErrorInit {
  readonly kind: ApiErrorKind;
  readonly status: number;
  readonly method: string;
  readonly url: string;
  readonly body?: unknown;
  readonly issues?: readonly ContractIssue[];
}

const MESSAGE_SEPARATOR = '. ';

function hasMessage(body: unknown): body is { message: unknown } {
  return typeof body === 'object' && body !== null && 'message' in body;
}

/** `message` de NestJS (string, o array unido con ". "), o `null` si no hay. */
export function nestMessageOf(body: unknown): string | null {
  if (!hasMessage(body)) return null;
  const { message } = body;
  if (Array.isArray(message)) {
    const parts = message.filter((m): m is string => typeof m === 'string');
    return parts.length > 0 ? parts.join(MESSAGE_SEPARATOR) : null;
  }
  return typeof message === 'string' && message.length > 0 ? message : null;
}

function userMessageOf(init: ApiErrorInit): string {
  if (init.kind === 'contract') return API_ERROR_COPY.CONTRACT;
  return (
    nestMessageOf(init.body) ??
    HTTP_STATUS_MESSAGES[init.status] ??
    API_ERROR_COPY.UNEXPECTED
  );
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number;
  readonly method: string;
  readonly url: string;
  readonly body: unknown;
  /** Solo en `kind: 'contract'` por schema: qué campos no cumplieron. */
  readonly issues: readonly ContractIssue[];

  constructor(init: ApiErrorInit) {
    super(userMessageOf(init));
    this.name = 'ApiError';
    this.kind = init.kind;
    this.status = init.status;
    this.method = init.method;
    this.url = init.url;
    this.body = init.body;
    this.issues = init.issues ?? [];
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}

/** Mensaje humano en español para cualquier cosa lanzada (equivale a `extractMessage`). */
export function extractErrorMessage(
  error: unknown,
  fallback: string = API_ERROR_COPY.UNEXPECTED,
): string {
  if (error instanceof Error && error.message.length > 0) return error.message;
  return fallback;
}
