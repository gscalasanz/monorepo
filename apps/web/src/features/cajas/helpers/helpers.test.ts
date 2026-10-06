import {
  cajaResponseSchema,
  consolidadoSaldosSchema,
  movimientoSchema,
  type CajaConSaldo,
  type Movimiento,
} from '@/shared/domain';
import {
  CAJA_RESPONSE_FIXTURE,
  MOVIMIENTO_FIXTURE,
} from '@/shared/domain/testing/fixtures';
import {
  isCuentaVisible,
  searchCuentas,
  toCuentaRows,
} from '@/features/cajas/helpers/cuentas';
import {
  buildFondoSolidarioView,
  transferenciasRecibidas,
} from '@/features/cajas/helpers/fondo-solidario';
import {
  buildFondosRamaStats,
  movimientosRamasParams,
  tipoCajaParam,
  toggleRamaChip,
} from '@/features/cajas/helpers/fondos-rama';
import {
  drawerEmptyMessage,
  filterDrawerMovimientos,
  movimientoCajaLabel,
  ultimosMovimientos,
} from '@/features/cajas/helpers/movimientos';
import {
  QUICK_MOVIMIENTO_INITIAL,
  buildQuickMovimientoDto,
  cajaDisplayName,
  conceptoOptions,
  withEstadoPago,
  withResponsable,
  withTipo,
} from '@/features/cajas/helpers/quick-movimiento';
import { parseCajasTab } from '@/features/cajas/helpers/tabs';
import {
  buildTransferenciaDto,
  destinoOptions,
  transferenciaPrecheck,
} from '@/features/cajas/helpers/transferencia';

const caja = (patch: Partial<CajaConSaldo> = {}): CajaConSaldo => ({
  ...cajaResponseSchema.parse(CAJA_RESPONSE_FIXTURE),
  ...patch,
});

const mov = (patch: Record<string, unknown> = {}): Movimiento =>
  movimientoSchema.parse({ ...MOVIMIENTO_FIXTURE, ...patch });

describe('tabs', () => {
  it('default grupo y valores conocidos', () => {
    expect(parseCajasTab(null)).toBe('grupo');
    expect(parseCajasTab('xx')).toBe('grupo');
    expect(parseCajasTab('fondo-solidario')).toBe('fondo-solidario');
  });
});

describe('movimientos', () => {
  const ingreso = mov({ id: 'i', tipo: 'ingreso', concepto: 'ajuste_inicial' });
  const egreso = mov({ id: 'e' });

  it('filtra el drawer por tipo y elige el vacío correcto', () => {
    expect(
      filterDrawerMovimientos([ingreso, egreso], 'ingresos').map((m) => m.id),
    ).toEqual(['i']);
    expect(
      filterDrawerMovimientos([ingreso, egreso], 'egresos').map((m) => m.id),
    ).toEqual(['e']);
    expect(drawerEmptyMessage('todos')).toBe(
      'Esta caja aún no tiene movimientos registrados.',
    );
    expect(drawerEmptyMessage('egresos')).toBe(
      'No hay egresos registrados en esta caja.',
    );
  });

  it('últimos 10 y nombre de la caja', () => {
    const many = Array.from({ length: 12 }, (_, i) => mov({ id: `m${i}` }));
    expect(ultimosMovimientos(many)).toHaveLength(10);
    expect(movimientoCajaLabel(egreso)).toBe('-');
    const conCaja = mov({
      caja: {
        ...MOVIMIENTO_FIXTURE,
        id: 'c',
        tipo: 'rama_manada',
        nombre: null,
        propietarioId: null,
      },
    });
    expect(movimientoCajaLabel(conCaja)).toBe('Fondo Manada');
  });
});

describe('fondos de rama', () => {
  it('chips: Todas limpia, una rama saca Todas, vacío vuelve a Todas', () => {
    expect(toggleRamaChip([null], 'rama_unidad')).toEqual(['rama_unidad']);
    expect(toggleRamaChip(['rama_unidad'], 'rama_rovers')).toEqual([
      'rama_unidad',
      'rama_rovers',
    ]);
    expect(toggleRamaChip(['rama_unidad'], 'rama_unidad')).toEqual([null]);
    expect(toggleRamaChip(['rama_unidad'], null)).toEqual([null]);
  });

  it('tipoCaja CSV y query de movimientos', () => {
    expect(tipoCajaParam([null])).toBe(
      'rama_manada,rama_unidad,rama_caminantes,rama_rovers',
    );
    expect(tipoCajaParam(['rama_rovers'])).toBe('rama_rovers');
    expect(
      movimientosRamasParams(
        { tipo: 'egreso', fecha: { from: '2026-01-01', to: '2026-02-01' } },
        ['rama_manada'],
      ),
    ).toEqual({
      page: 1,
      limit: 50,
      tipoCaja: 'rama_manada',
      tipo: 'egreso',
      concepto: undefined,
      fechaInicio: '2026-01-01T03:00:00.000Z',
      fechaFin: '2026-02-02T02:59:59.999Z',
    });
  });

  it('saldos por fondo (0 si falta) y total', () => {
    const stats = buildFondosRamaStats({
      rama_manada: caja({ id: 'm', tipo: 'rama_manada', saldoActual: 100 }),
      rama_rovers: caja({ id: 'r', tipo: 'rama_rovers', saldoActual: 50 }),
    });
    expect(stats.total).toBe(150);
    expect(stats.fondos.map((f) => [f.label, f.saldo, f.cajaId])).toEqual([
      ['Fondo Manada', 100, 'm'],
      ['Fondo Unidad', 0, null],
      ['Fondo Caminantes', 0, null],
      ['Fondo Rovers', 50, 'r'],
    ]);
  });
});

describe('cuentas personales', () => {
  it('deshabilitado solo con saldo distinto de cero', () => {
    const inactivo = {
      id: 'p',
      nombre: 'Ana',
      estado: 'inactivo' as const,
      rama: null,
    };
    expect(
      isCuentaVisible(caja({ propietario: inactivo, saldoActual: 0 })),
    ).toBe(false);
    expect(
      isCuentaVisible(caja({ propietario: inactivo, saldoActual: -10 })),
    ).toBe(true);
    expect(isCuentaVisible(caja())).toBe(true);
  });

  it('filas y búsqueda case-insensitive', () => {
    const rows = toCuentaRows([
      caja(),
      caja({ id: 'x', propietario: null, nombre: null }),
    ]);
    expect(rows.map((r) => [r.nombre, r.rama])).toEqual([
      ['Juan', 'Manada'],
      ['-', null],
    ]);
    expect(searchCuentas(rows, 'JU').map((r) => r.id)).toEqual(['caja-2']);
  });
});

describe('fondo solidario', () => {
  const consolidado = consolidadoSaldosSchema.parse({
    fecha: '2026-10-06T12:00:00.000Z',
    resumen: { totalGeneral: 0, totalDisponible: 0, totalPorCobrar: 0 },
    cajaGrupo: { id: 'g', saldo: 1000 },
    fondosRama: { total: 0, detalle: [] },
    cuentasPersonales: { total: 0, cantidad: 0 },
    fondoSolidario: { id: null, saldo: 7, bonificacionesOtorgadas: 300 },
    reembolsosPendientes: { total: 0, cantidad: 0 },
    cobrosPendientes: { total: 0, cantidad: 0 },
    deudasTotales: {
      total: 0,
      inscripciones: { total: 0, cantidad: 0 },
      campamentos: { total: 0, cantidad: 0 },
    },
  });

  it('solo lista transferencias entre cajas', () => {
    const rows = transferenciasRecibidas([
      mov({
        id: 't',
        tipo: 'ingreso',
        concepto: 'transferencia_entre_cajas',
        descripcion: null,
      }),
      mov({ id: 'b', concepto: 'bonificacion_otorgada' }),
    ]);
    expect(rows).toEqual([
      expect.objectContaining({
        id: 't',
        descripcion: null,
        responsable: null,
      }),
    ]);
  });

  it('sin caja: usa el consolidado; con caja: su id y saldo', () => {
    const sin = buildFondoSolidarioView({
      consolidado,
      fondo: { caja: null, historial: [] },
      movimientos: [],
    });
    expect(sin).toMatchObject({
      cajaId: null,
      saldo: 7,
      bonificado: 300,
      cajaGrupo: { id: 'g', saldo: 1000 },
    });
    const fs = caja({
      id: 'fs',
      tipo: 'fondo_solidario',
      saldoActual: 90,
      propietario: null,
    });
    const con = buildFondoSolidarioView({
      consolidado,
      fondo: { caja: fs, historial: [] },
      movimientos: [],
    });
    expect(con).toMatchObject({ cajaId: 'fs', saldo: 90 });
  });
});

describe('transferencia', () => {
  it('destinos sin el origen ni cuentas personales', () => {
    const options = destinoOptions(
      [
        caja({ id: 'g', tipo: 'grupo', nombre: null }),
        caja({ id: 'm', tipo: 'rama_manada', nombre: null }),
        caja({ id: 'p' }),
        caja({ id: 'fs', tipo: 'fondo_solidario', nombre: 'Fondo Solidario' }),
      ],
      'g',
    );
    expect(options).toEqual([
      { value: 'm', label: 'Fondo Manada' },
      { value: 'fs', label: 'Fondo Solidario' },
    ]);
  });

  it('chequeos de cliente: usuario y saldo', () => {
    expect(transferenciaPrecheck({ userId: null, monto: 1, saldo: 10 })).toBe(
      'No se pudo identificar al usuario autenticado',
    );
    expect(
      transferenciaPrecheck({ userId: 'u', monto: 11, saldo: 10 }),
    ).toMatch(/^Saldo insuficiente en caja de grupo \(disponible: /);
    expect(
      transferenciaPrecheck({ userId: 'u', monto: 10, saldo: 10 }),
    ).toBeNull();
  });

  it('DTO omite descripción vacía', () => {
    const values = {
      cajaDestinoId: 'm',
      monto: 5,
      fecha: '2026-10-06',
      descripcion: '  ',
    };
    expect(
      buildTransferenciaDto({ origenId: 'g', responsableId: 'u', values }),
    ).toEqual({
      cajaOrigenId: 'g',
      cajaDestinoId: 'm',
      monto: 5,
      responsableId: 'u',
      fecha: '2026-10-06',
    });
    expect(
      buildTransferenciaDto({
        origenId: 'g',
        responsableId: 'u',
        values: { ...values, monto: null },
      }),
    ).toBeNull();
  });
});

describe('movimiento rápido', () => {
  it('conceptos manuales por tipo y reset al cambiar tipo', () => {
    expect(conceptoOptions('ingreso').map((o) => o.value)).toContain(
      'ajuste_inicial',
    );
    expect(conceptoOptions('ingreso').map((o) => o.value)).not.toContain(
      'transferencia_entre_cajas',
    );
    const conConcepto = {
      ...QUICK_MOVIMIENTO_INITIAL,
      concepto: 'ajuste_inicial' as const,
    };
    expect(withTipo(conConcepto, 'egreso')).toMatchObject({
      tipo: 'egreso',
      concepto: null,
    });
  });

  it('persona a reembolsar sigue al responsable mientras está pendiente', () => {
    const conResp = withResponsable(QUICK_MOVIMIENTO_INITIAL, 'a');
    const pendiente = withEstadoPago(conResp, 'pendiente_reembolso');
    expect(pendiente.personaAReembolsarId).toBe('a');
    expect(withResponsable(pendiente, 'b').personaAReembolsarId).toBe('b');
    expect(withEstadoPago(pendiente, 'pagado').personaAReembolsarId).toBeNull();
  });

  it('DTO con requiereComprobante false y sin opcionales vacíos', () => {
    const values = {
      ...QUICK_MOVIMIENTO_INITIAL,
      concepto: 'ajuste_inicial' as const,
      monto: 1,
      responsableId: 'u',
    };
    expect(buildQuickMovimientoDto(values, 'c')).toEqual({
      cajaId: 'c',
      tipo: 'ingreso',
      monto: 1,
      concepto: 'ajuste_inicial',
      responsableId: 'u',
      medioPago: 'efectivo',
      estadoPago: 'pagado',
      requiereComprobante: false,
    });
    expect(buildQuickMovimientoDto(QUICK_MOVIMIENTO_INITIAL, 'c')).toBeNull();
  });

  it('nombre visible de la caja', () => {
    expect(
      cajaDisplayName({ id: 'abcdefghij', nombre: null, tipo: 'grupo' }),
    ).toBe('Caja de Grupo');
    expect(
      cajaDisplayName({ id: 'x', nombre: 'Caja Chica', tipo: 'grupo' }),
    ).toBe('Caja Chica');
  });
});
