import { campamentoSchema, eventoSchema, movimientoSchema, cajaSchema } from '@/shared/domain';
import { CAMPAMENTO_FIXTURE, EVENTO_FIXTURE, MOVIMIENTO_FIXTURE } from '@/shared/domain/testing/fixtures';
import { asLocalDate } from '@/shared/time';
import { CONSOLIDADO } from '@/features/dashboard/testing/fixtures';
import {
  buildFondosRama,
  buildTreasury,
  recentMovimientos,
  upcomingItems,
} from '@/features/dashboard/helpers/view-model';

describe('buildTreasury', () => {
  it('el total es el `totalGeneral` del backend (las 4 cajas) y la deuda el `totalPorCobrar`', () => {
    const treasury = buildTreasury(CONSOLIDADO);
    expect(treasury.total).toBe(1420);
    expect(treasury.porCobrar).toBe(900);
  });

  it('reparte en caja grupo, fondos de rama, cuentas personales y fondo solidario (en ese orden)', () => {
    const { segments } = buildTreasury(CONSOLIDADO);
    expect(segments.map((s) => [s.label, s.value])).toEqual([
      ['Caja de Grupo', 1000],
      ['Fondos de Rama', 300],
      ['Cuentas Personales', 50],
      ['Fondo Solidario', 70],
    ]);
  });

  it('cada caja lleva a su pestaña en Cajas', () => {
    const { segments } = buildTreasury(CONSOLIDADO);
    expect(segments.map((s) => s.href)).toEqual([
      '/cajas?tab=grupo',
      '/cajas?tab=rama',
      '/cajas?tab=personal',
      '/cajas?tab=fondo-solidario',
    ]);
  });

  it('cada tramo tiene un color distinto', () => {
    const colors = buildTreasury(CONSOLIDADO).segments.map((s) => s.color);
    expect(new Set(colors).size).toBe(4);
  });

  it('conserva reembolsos y cobros pendientes', () => {
    const { reembolsos, cobros } = buildTreasury(CONSOLIDADO);
    expect([reembolsos, cobros]).toEqual([20, 30]);
  });

  it('sin consolidado todo es cero', () => {
    const empty = buildTreasury(null);
    expect(empty.total).toBe(0);
    expect(empty.segments.every((s) => s.value === 0)).toBe(true);
  });
});

describe('buildFondosRama', () => {
  it('en orden de ramas, solo las presentes', () => {
    expect(buildFondosRama(CONSOLIDADO)).toEqual([
      { rama: 'Manada', saldo: 100 },
      { rama: 'Unidad', saldo: 200 },
    ]);
    expect(buildFondosRama(null)).toEqual([]);
  });
});

describe('upcomingItems', () => {
  const today = asLocalDate('2026-10-06');
  const evento = (fecha: string, i: number) => ({ ...eventoSchema.parse(EVENTO_FIXTURE), id: `e${i}`, fecha: asLocalDate(fecha) });
  const campamento = (fechaInicio: string, id: string) => ({
    ...campamentoSchema.parse(CAMPAMENTO_FIXTURE),
    id,
    fechaInicio: asLocalDate(fechaInicio),
  });

  it('desde hoy, ascendentes, máx. 3', () => {
    const eventos = ['2026-10-05', '2026-12-01', '2026-10-06', '2026-11-01', '2026-10-20'].map(evento);
    const result = upcomingItems({ eventos, campamentos: [], today });
    expect(result.map((e) => e.fecha)).toEqual(['2026-10-06', '2026-10-20', '2026-11-01']);
  });

  it('mezcla eventos y campamentos por fecha de inicio, cada uno con su link', () => {
    const result = upcomingItems({
      eventos: [evento('2026-11-10', 1)],
      campamentos: [campamento('2026-10-15', 'c1'), campamento('2026-09-01', 'c-pasado')],
      today,
    });
    expect(result.map((i) => [i.kind, i.fecha, i.href])).toEqual([
      ['campamento', '2026-10-15', '/campamentos/c1'],
      [expect.stringMatching(/venta|grupo/), '2026-11-10', '/eventos/e1'],
    ]);
  });
});

describe('recentMovimientos', () => {
  const mov = movimientoSchema.parse(MOVIMIENTO_FIXTURE);

  it('limita a 8 filas', () => {
    expect(recentMovimientos(Array(10).fill(mov))).toHaveLength(8);
  });

  it('signo, título, responsable, medio y fecha corta', () => {
    const [row] = recentMovimientos([mov]);
    expect(row).toMatchObject({
      direction: 'out',
      title: 'Garrafa',
      amount: -1500.5,
      responsable: 'Sistema',
      medio: 'Efectivo',
      fecha: '13 mar',
    });
  });

  it('cada fila lleva al formulario de edición del movimiento', () => {
    expect(recentMovimientos([mov])[0]?.href).toBe(`/movimientos/${mov.id}/editar`);
  });

  it('sin caja cargada muestra el placeholder; con caja usa su nombre', () => {
    expect(recentMovimientos([mov])[0]?.caja).toBe('—');
    const caja = cajaSchema.parse({
      createdAt: mov.createdAt, updatedAt: mov.updatedAt, deletedAt: null,
      id: 'c', tipo: 'grupo', nombre: 'Caja del grupo', propietarioId: null,
    });
    expect(recentMovimientos([{ ...mov, caja }])[0]?.caja).toBe('Caja del grupo');
  });

  it('caja sin nombre cae al nombre del tipo', () => {
    const caja = cajaSchema.parse({
      createdAt: mov.createdAt, updatedAt: mov.updatedAt, deletedAt: null,
      id: 'c', tipo: 'fondo_solidario', nombre: null, propietarioId: null,
    });
    expect(recentMovimientos([{ ...mov, caja }])[0]?.caja).toBe('Fondo Solidario');
  });
});
