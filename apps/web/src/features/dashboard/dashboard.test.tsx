import { render, screen, waitFor } from '@testing-library/react';

import {
  consolidadoSaldosSchema,
  eventoSchema,
  movimientoSchema,
  type ConsolidadoSaldos,
} from '@/shared/domain';
import { EVENTO_FIXTURE, MOVIMIENTO_FIXTURE } from '@/shared/domain/testing/fixtures';
import { asLocalDate } from '@/shared/time';
import { DashboardView } from '@/features/dashboard';
import {
  buildFondosRama,
  buildKpis,
  recentMovimientos,
  upcomingEventos,
} from '@/features/dashboard/helpers/view-model';

const fetchDashboardData = vi.fn();
vi.mock('@/features/dashboard/services/dashboard-api', () => ({
  fetchDashboardData: () => fetchDashboardData(),
}));

const CONSOLIDADO: ConsolidadoSaldos = consolidadoSaldosSchema.parse({
  fecha: '2026-10-06T12:00:00.000Z',
  resumen: { totalGeneral: 0, totalDisponible: 0, totalPorCobrar: 0 },
  cajaGrupo: { id: 'g', saldo: 1000 },
  fondosRama: {
    total: 300,
    detalle: [
      { tipo: 'rama_unidad', id: 'u', nombre: 'Unidad', saldo: 200 },
      { tipo: 'rama_manada', id: 'm', nombre: 'Manada', saldo: 100 },
    ],
  },
  cuentasPersonales: { total: 50, cantidad: 2 },
  fondoSolidario: { id: 'fs', saldo: 70, bonificacionesOtorgadas: 0 },
  reembolsosPendientes: { total: 20, cantidad: 1 },
  cobrosPendientes: { total: 30, cantidad: 1 },
  deudasTotales: {
    total: 0,
    inscripciones: { total: 0, cantidad: 0 },
    campamentos: { total: 0, cantidad: 0 },
  },
});

describe('view-model del dashboard', () => {
  it('KPIs en el orden de Angular', () => {
    expect(buildKpis(CONSOLIDADO).map((k) => [k.label, k.value])).toEqual([
      ['Caja de Grupo', 1000],
      ['Fondos de Rama', 300],
      ['Cuentas Personales', 50],
      ['Reembolsos Pendientes', 20],
      ['Cobros Pendientes', 30],
      ['Fondo Solidario', 70],
    ]);
    expect(buildKpis(null).every((k) => k.value === 0)).toBe(true);
  });

  it('fondos por rama en orden de ramas, solo las presentes', () => {
    expect(buildFondosRama(CONSOLIDADO)).toEqual([
      { rama: 'Manada', saldo: 100 },
      { rama: 'Unidad', saldo: 200 },
    ]);
    expect(buildFondosRama(null)).toEqual([]);
  });

  it('próximos eventos: desde hoy, ascendentes, máx. 3', () => {
    const base = eventoSchema.parse(EVENTO_FIXTURE);
    const eventos = ['2026-10-05', '2026-12-01', '2026-10-06', '2026-11-01', '2026-10-20'].map(
      (fecha, i) => ({ ...base, id: `e${i}`, fecha: asLocalDate(fecha) }),
    );
    const result = upcomingEventos(eventos, asLocalDate('2026-10-06'));
    expect(result.map((e) => e.fecha)).toEqual(['2026-10-06', '2026-10-20', '2026-11-01']);
  });

  it('movimientos recientes: signo, texto y detalle', () => {
    const mov = movimientoSchema.parse(MOVIMIENTO_FIXTURE);
    const [row] = recentMovimientos([mov, mov, mov, mov, mov, mov]);
    expect(recentMovimientos(Array(6).fill(mov))).toHaveLength(5);
    expect(row).toMatchObject({ direction: 'out', title: 'Garrafa', amount: -1500.5 });
    expect(row?.detail).toBe('Sistema • 13/03/2026');
  });
});

describe('DashboardView', () => {
  it('renderiza KPIs y vacíos con datos del backend', async () => {
    fetchDashboardData.mockResolvedValue({ consolidado: CONSOLIDADO, eventos: [], recientes: [] });
    render(<DashboardView />);
    expect(await screen.findByText('Caja de Grupo')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('No hay eventos próximos')).toBeInTheDocument());
    expect(screen.getByText('No hay movimientos recientes')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Registrar Gasto/ })).toHaveAttribute('href', '/movimientos/nuevo');
  });
});
