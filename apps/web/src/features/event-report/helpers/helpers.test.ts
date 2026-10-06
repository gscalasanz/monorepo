import { ApiError } from '@/shared/api';
import {
  franjaPico,
  fueraDeDiaSummary,
  hasGananciaPorPersona,
  isReporteVenta,
  pendientesDePago,
  porTipoSegments,
  ramaSlices,
  rankingRows,
  stockPendientePct,
  sumMontos,
} from '@/features/event-report/helpers/derived';
import {
  formatPct,
  medioPagoLabel,
} from '@/features/event-report/helpers/format';
import { kpisFor } from '@/features/event-report/helpers/kpis';
import { loadEventReport } from '@/features/event-report/helpers/load-report';
import type { ReporteVenta } from '@/features/event-report/models/report';
import {
  REPORTE_GRUPO,
  REPORTE_MIXTO,
  REPORTE_PERSONALES,
  REPORTE_VENTA,
} from '@/features/event-report/testing/fixtures';

const mocks = vi.hoisted(() => ({
  fetchReporte: vi.fn(),
  fetchReportePublico: vi.fn(),
}));
vi.mock('@/features/event-report/services/event-report-api', () => mocks);

function asVenta(): ReporteVenta {
  if (!isReporteVenta(REPORTE_VENTA)) throw new Error('fixture inválido');
  return REPORTE_VENTA;
}

const httpError = (status: number) =>
  new ApiError({ kind: 'http', status, method: 'GET', url: '/x' });

describe('format', () => {
  it('formatPct: ratio → % con máx. 1 decimal (es-AR)', () => {
    expect(formatPct(0.4)).toBe('40%');
    expect(formatPct(0.125)).toBe('12,5%');
    expect(formatPct(1 / 3)).toBe('33,3%');
  });

  it('medioPagoLabel: label conocido o el valor tal cual', () => {
    expect(medioPagoLabel('efectivo')).toBe('Efectivo');
    expect(medioPagoLabel('cripto')).toBe('cripto');
  });
});

describe('kpisFor', () => {
  it('venta caja grupo: 6 KPIs con bajadas, sin recupero', () => {
    const kpis = kpisFor(REPORTE_VENTA);
    expect(kpis.map((k) => k.label)).toEqual([
      'Recaudación bruta',
      'Resultado neto real',
      'Egresos',
      'Margen neto',
      'Vendedores',
      'Pendiente de retiro',
    ]);
    expect(kpis[0]?.sub).toBe('20 unidades vendidas');
    expect(kpis[2]?.sub).toBe('2 gastos (insumos)');
    expect(kpis[3]?.value).toBe('80%');
    expect(kpis[4]).toMatchObject({
      value: '3',
      sub: '1 educadores · 2 protagonistas',
    });
    expect(kpis[5]).toMatchObject({ value: '2', sub: 'de 20 vendidas' });
  });

  it('cuentas personales: suma "Costo recuperado por el grupo" si hay recupero', () => {
    expect(kpisFor(REPORTE_PERSONALES).at(-1)?.label).toBe(
      'Costo recuperado por el grupo',
    );
  });

  it('mixto: agrega netos por destino y "A cobrar" si hay pendiente', () => {
    const labels = kpisFor(REPORTE_MIXTO).map((k) => k.label);
    expect(labels.slice(-3)).toEqual([
      'Neto caja del grupo',
      'Neto cuentas personales',
      'A cobrar',
    ]);
  });

  it('grupo: Ingresos, Egresos, Resultado neto, Margen', () => {
    expect(kpisFor(REPORTE_GRUPO).map((k) => k.label)).toEqual([
      'Ingresos',
      'Egresos',
      'Resultado neto',
      'Margen',
    ]);
  });
});

describe('derived', () => {
  it('pendientesDePago filtra pendiente_reembolso; sumMontos suma', () => {
    const pendientes = pendientesDePago(REPORTE_VENTA.egresos);
    expect(pendientes.map((e) => e.descripcion)).toEqual(['Carbón']);
    expect(sumMontos(REPORTE_VENTA.egresos)).toBe(2000);
  });

  it('rankingRows ordena por recaudado y escala la barra al primero', () => {
    const rows = rankingRows(asVenta().vendedores);
    expect(rows.map((r) => r.nombre)).toEqual(['Carla', 'Dani', 'Beto']);
    expect(rows.map((r) => r.width)).toEqual([100, 100, 50]);
    expect(rows.map((r) => r.tag)).toEqual(['E', 'P', 'P']);
    expect(rankingRows([])).toEqual([]);
  });

  it('stockPendientePct: pendiente / vendido, 0% sin ventas', () => {
    expect(stockPendientePct(asVenta().stock)).toBe('10%');
    expect(
      stockPendientePct({
        productos: [],
        totalVendido: 0,
        totalEntregado: 0,
        totalPendiente: 0,
      }),
    ).toBe('0%');
  });

  it('horarios: franja pico y resumen fuera del día', () => {
    const { horariosEntrega } = asVenta();
    expect(franjaPico(horariosEntrega)).toBe('18:30');
    expect(fueraDeDiaSummary(horariosEntrega)).toEqual({
      total: 1,
      dias: 'domingo 26/05',
    });
    const vacio = { ...horariosEntrega, franjas: [], fueraDeDia: [] };
    expect(franjaPico(vacio)).toBeNull();
    expect(fueraDeDiaSummary(vacio)).toBeNull();
  });

  it('ramaSlices: token de rama y color de educador', () => {
    expect(ramaSlices(asVenta().porRama).map((s) => s.color)).toEqual([
      'var(--color-rama-manada)',
      'var(--color-data-3)',
    ]);
    expect(
      porTipoSegments(asVenta().porTipoPersona).map((s) => s.label),
    ).toEqual(['Educadores', 'Protagonistas']);
  });

  it('type guards por variante', () => {
    expect(isReporteVenta(REPORTE_GRUPO)).toBe(false);
    expect(hasGananciaPorPersona(REPORTE_VENTA)).toBe(false);
    expect(hasGananciaPorPersona(REPORTE_PERSONALES)).toBe(true);
    expect(hasGananciaPorPersona(REPORTE_MIXTO)).toBe(true);
  });
});

describe('loadEventReport', () => {
  const signal = new AbortController().signal;
  beforeEach(() => vi.resetAllMocks());

  it('con sesión usa el endpoint autenticado', async () => {
    mocks.fetchReporte.mockResolvedValue(REPORTE_VENTA);
    await expect(
      loadEventReport({ eventoId: 'e1', withSession: true, signal }),
    ).resolves.toEqual({
      status: 'ok',
      reporte: REPORTE_VENTA,
    });
    expect(mocks.fetchReportePublico).not.toHaveBeenCalled();
  });

  it('anónimo usa el público; 404 → unavailable', async () => {
    mocks.fetchReportePublico.mockRejectedValue(httpError(404));
    await expect(
      loadEventReport({ eventoId: 'e1', withSession: false, signal }),
    ).resolves.toEqual({
      status: 'unavailable',
    });
    expect(mocks.fetchReporte).not.toHaveBeenCalled();
  });

  it('otros errores (o 404 con sesión) se propagan', async () => {
    mocks.fetchReportePublico.mockRejectedValue(httpError(500));
    await expect(
      loadEventReport({ eventoId: 'e1', withSession: false, signal }),
    ).rejects.toBeInstanceOf(ApiError);
    mocks.fetchReporte.mockRejectedValue(httpError(404));
    await expect(
      loadEventReport({ eventoId: 'e1', withSession: true, signal }),
    ).rejects.toBeInstanceOf(ApiError);
  });
});
