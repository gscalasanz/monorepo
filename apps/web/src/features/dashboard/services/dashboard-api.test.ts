import { API_ENDPOINTS } from '@/shared/api';
import { fetchDashboardData } from '@/features/dashboard/services/dashboard-api';
import { CONSOLIDADO } from '@/features/dashboard/testing/fixtures';

const get = vi.fn();
vi.mock('@/shared/api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/api')>()),
  apiClient: { get: (...args: unknown[]) => get(...args) },
}));

const SIGNAL = new AbortController().signal;

function respond(overrides: Readonly<Record<string, () => Promise<unknown>>> = {}) {
  get.mockImplementation((endpoint: string) => {
    const override = overrides[endpoint];
    if (override) return override();
    return Promise.resolve(endpoint === API_ENDPOINTS.CAJAS_CONSOLIDADO ? CONSOLIDADO : []);
  });
}

beforeEach(() => get.mockReset());

describe('fetchDashboardData', () => {
  it('trae consolidado, eventos, recientes, deudas e inscripciones del año en paralelo', async () => {
    respond();
    const data = await fetchDashboardData(SIGNAL);
    expect(data.consolidado).toEqual(CONSOLIDADO);
    const endpoints = get.mock.calls.map((call) => call[0]);
    expect(endpoints).toEqual(
      expect.arrayContaining([
        API_ENDPOINTS.CAJAS_CONSOLIDADO,
        API_ENDPOINTS.EVENTOS,
        API_ENDPOINTS.MOVIMIENTOS_RECIENTES,
        API_ENDPOINTS.REPORTES_DEUDAS,
        API_ENDPOINTS.INSCRIPCIONES,
      ]),
    );
  });

  it('pide las inscripciones del año actual', async () => {
    respond();
    await fetchDashboardData(SIGNAL);
    const call = get.mock.calls.find((c) => c[0] === API_ENDPOINTS.INSCRIPCIONES);
    expect(call?.[1].params).toEqual({ ano: expect.any(Number) });
  });

  it('si fallan las listas secundarias quedan vacías y el consolidado sigue', async () => {
    const fail = () => Promise.reject(new Error('boom'));
    respond({
      [API_ENDPOINTS.EVENTOS]: fail,
      [API_ENDPOINTS.MOVIMIENTOS_RECIENTES]: fail,
      [API_ENDPOINTS.REPORTES_DEUDAS]: fail,
      [API_ENDPOINTS.INSCRIPCIONES]: fail,
    });
    const data = await fetchDashboardData(SIGNAL);
    expect(data).toMatchObject({ eventos: [], recientes: [], deudas: [], inscripciones: [] });
    expect(data.consolidado).toEqual(CONSOLIDADO);
  });

  it('si falla el consolidado queda en null', async () => {
    respond({ [API_ENDPOINTS.CAJAS_CONSOLIDADO]: () => Promise.reject(new Error('boom')) });
    expect((await fetchDashboardData(SIGNAL)).consolidado).toBeNull();
  });
});
