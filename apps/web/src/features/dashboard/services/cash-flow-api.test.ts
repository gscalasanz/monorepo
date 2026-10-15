import { asLocalDate } from '@/shared/time';
import { MAX_HISTORY_PAGES } from '@/features/dashboard/constants/cash-flow';
import { fetchMovimientosSince } from '@/features/dashboard/services/cash-flow-api';

const get = vi.fn();
vi.mock('@/shared/api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/api')>()),
  apiClient: { get: (...args: unknown[]) => get(...args) },
}));

const page = (n: number, totalPages: number) => ({
  data: [{ id: `m${n}` }],
  meta: { page: n, limit: 100, total: totalPages, totalPages, hasPreviousPage: n > 1, hasNextPage: n < totalPages },
});

const SIGNAL = new AbortController().signal;
const FROM = asLocalDate('2025-11-01');

beforeEach(() => {
  get.mockReset();
  get.mockImplementation((_endpoint: string, options: { params: { page: number } }) =>
    Promise.resolve(page(options.params.page, 3)),
  );
});

describe('fetchMovimientosSince', () => {
  it('pide la primera página y el resto en paralelo, en orden', async () => {
    const result = await fetchMovimientosSince({ from: FROM, signal: SIGNAL });
    expect(get).toHaveBeenCalledTimes(3);
    expect(result.movimientos.map((m) => m.id)).toEqual(['m1', 'm2', 'm3']);
    expect(result.truncated).toBe(false);
  });

  it('manda limit 100 y fechaInicio como inicio del día en Buenos Aires', async () => {
    await fetchMovimientosSince({ from: FROM, signal: SIGNAL });
    const params = get.mock.calls[0]?.[1].params;
    expect(params.limit).toBe(100);
    expect(params.fechaInicio).toBe('2025-11-01T03:00:00.000Z');
  });

  it('una sola página no pide más', async () => {
    get.mockResolvedValueOnce(page(1, 1));
    const result = await fetchMovimientosSince({ from: FROM, signal: SIGNAL });
    expect(get).toHaveBeenCalledTimes(1);
    expect(result.truncated).toBe(false);
  });

  it('con más páginas que el tope trae solo el tope y avisa que quedó truncado', async () => {
    get.mockImplementation((_e: string, options: { params: { page: number } }) =>
      Promise.resolve(page(options.params.page, MAX_HISTORY_PAGES + 5)),
    );
    const result = await fetchMovimientosSince({ from: FROM, signal: SIGNAL });
    expect(get).toHaveBeenCalledTimes(MAX_HISTORY_PAGES);
    expect(result.truncated).toBe(true);
  });

  it('propaga el error (no lo traga)', async () => {
    get.mockRejectedValueOnce(new Error('boom'));
    await expect(fetchMovimientosSince({ from: FROM, signal: SIGNAL })).rejects.toThrow('boom');
  });
});
