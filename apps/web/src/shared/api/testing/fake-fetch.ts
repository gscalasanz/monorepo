/**
 * `fetch` falso para tests del cliente: encola respuestas y registra cada
 * request (url, método, headers, body) para poder afirmar sobre ellas.
 */
export interface RecordedRequest {
  readonly url: string;
  readonly method: string;
  readonly headers: Readonly<Record<string, string>>;
  readonly body: unknown;
}

export type FakeReply =
  | { readonly status: number; readonly body?: unknown; readonly raw?: string }
  | { readonly networkError: true }
  | { readonly blobText: string };

export interface FakeFetch {
  readonly fetchFn: typeof fetch;
  readonly requests: RecordedRequest[];
  reply(...replies: FakeReply[]): void;
}

function toResponse(reply: FakeReply): Response {
  if ('networkError' in reply) throw new TypeError('Failed to fetch');
  if ('blobText' in reply) return new Response(reply.blobText, { status: 200 });
  const text =
    reply.raw ?? (reply.body === undefined ? '' : JSON.stringify(reply.body));
  return new Response(text === '' ? null : text, { status: reply.status });
}

function parseBody(body: BodyInit | null | undefined): unknown {
  return typeof body === 'string' ? JSON.parse(body) : body;
}

export function createFakeFetch(): FakeFetch {
  const queue: FakeReply[] = [];
  const requests: RecordedRequest[] = [];
  const fetchFn = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    init?.signal?.throwIfAborted();
    requests.push({
      url: String(input),
      method: init?.method ?? 'GET',
      headers: Object.fromEntries(new Headers(init?.headers).entries()),
      body: parseBody(init?.body),
    });
    const next = queue.shift();
    if (!next)
      throw new Error(`Request sin respuesta encolada: ${String(input)}`);
    return toResponse(next);
  };
  return {
    fetchFn: fetchFn as typeof fetch,
    requests,
    reply: (...replies) => {
      queue.push(...replies);
    },
  };
}
