import {
  CATEGORIA_MOVIMIENTO,
  CATEGORIA_MOVIMIENTO_LABELS,
  CONCEPTO_MOVIMIENTO,
  CONCEPTO_MOVIMIENTO_LABELS,
  CONCEPTOS_MANUALES_POR_TIPO,
  ESTADO_PAGO,
  ESTADO_PAGO_LABELS,
  FILTRO_MOVIMIENTOS,
  MEDIO_PAGO,
  MEDIO_PAGO_LABELS,
  TIPO_MOVIMIENTO,
  VENTA_DERIVED_CONCEPTOS,
  filterMovimientos,
  movimientoSchema,
  movimientosPaginatedSchema,
  pendientesPorPersonaSchema,
  transferenciaResultSchema,
} from '@/shared/domain';
import { MOVIMIENTO_FIXTURE, omitKeys } from '@/shared/domain/testing/fixtures';

describe('enums de movimiento (port de movimiento.enum.spec.ts)', () => {
  it('MEDIO_PAGO incluye los cuatro medios, mixto incluido', () => {
    expect(Object.values(MEDIO_PAGO)).toEqual([
      'efectivo',
      'transferencia',
      'saldo_personal',
      'mixto',
    ]);
    expect(MEDIO_PAGO_LABELS.mixto).toBe('Mixto');
  });

  it('no existe más el concepto cuota_grupo', () => {
    expect(Object.values(CONCEPTO_MOVIMIENTO)).not.toContain('cuota_grupo');
  });

  it('incluye los conceptos de bonificación del fondo solidario', () => {
    expect(CONCEPTO_MOVIMIENTO.BONIFICACION_OTORGADA).toBe(
      'bonificacion_otorgada',
    );
    expect(CONCEPTO_MOVIMIENTO.BONIFICACION_RECIBIDA).toBe(
      'bonificacion_recibida',
    );
  });

  it('todo concepto tiene label (sin esto la tabla muestra undefined)', () => {
    for (const concepto of Object.values(CONCEPTO_MOVIMIENTO)) {
      expect(CONCEPTO_MOVIMIENTO_LABELS[concepto]).toBeTruthy();
    }
  });

  it('las 8 categorías tienen label', () => {
    expect(Object.values(CATEGORIA_MOVIMIENTO)).toHaveLength(8);
    for (const categoria of Object.values(CATEGORIA_MOVIMIENTO)) {
      expect(CATEGORIA_MOVIMIENTO_LABELS[categoria]).toBeTruthy();
    }
  });

  it('todo estado de pago tiene label', () => {
    expect(ESTADO_PAGO_LABELS[ESTADO_PAGO.PENDIENTE_COBRO]).toBe('A cobrar');
  });

  it('VENTA_DERIVED_CONCEPTOS replica el backend', () => {
    expect(VENTA_DERIVED_CONCEPTOS).toEqual([
      'evento_venta_ingreso',
      'evento_venta_gasto',
      'evento_venta_recupero_costo',
    ]);
  });
});

describe('CONCEPTOS_MANUALES_POR_TIPO', () => {
  const ingresos = CONCEPTOS_MANUALES_POR_TIPO[TIPO_MOVIMIENTO.INGRESO];
  const egresos = CONCEPTOS_MANUALES_POR_TIPO[TIPO_MOVIMIENTO.EGRESO];

  it('ofrece todos los conceptos de ingreso manuales', () => {
    expect(ingresos).toEqual([
      'evento_venta_ingreso',
      'evento_venta_recupero_costo',
      'evento_grupo_ingreso',
      'asignacion_fondo_rama',
      'ajuste_inicial',
    ]);
  });

  it('ofrece todos los conceptos de egreso manuales', () => {
    expect(egresos).toEqual([
      'campamento_gasto',
      'evento_venta_gasto',
      'evento_grupo_gasto',
      'gasto_general',
      'reembolso',
      'ajuste_inicial',
    ]);
  });

  it('excluye los conceptos ligados en pareja y los pagos con flujo propio', () => {
    const excluidos = [
      'transferencia_entre_cajas',
      'transferencia_saldo_personal',
      'bonificacion_otorgada',
      'bonificacion_recibida',
      'uso_saldo_personal',
      'inscripcion_grupo',
      'inscripcion_scout_argentina',
      'inscripcion_pago_scout_argentina',
      'campamento_pago',
    ];
    for (const concepto of excluidos) {
      expect([...ingresos, ...egresos]).not.toContain(concepto);
    }
  });
});

describe('movimientoSchema', () => {
  it('parsea el JSON real: monto string → number, fecha → Instant', () => {
    const movimiento = movimientoSchema.parse(MOVIMIENTO_FIXTURE);
    expect(movimiento.monto).toBe(1500.5);
    expect(movimiento.fecha).toBe('2026-03-13T15:00:00.000Z');
    expect(movimiento.caja).toBeUndefined();
  });

  it('una respuesta de POST sin claves nullable las normaliza a null', () => {
    const fromPost = omitKeys(MOVIMIENTO_FIXTURE, ['categoria', 'descripcion']);
    const movimiento = movimientoSchema.parse({ ...fromPost, monto: 1500.5 });
    expect(movimiento.categoria).toBeNull();
    expect(movimiento.descripcion).toBeNull();
  });

  it('acepta relaciones cargadas (caja, responsable)', () => {
    const movimiento = movimientoSchema.parse({
      ...MOVIMIENTO_FIXTURE,
      caja: {
        id: 'caja-1',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        deletedAt: null,
        tipo: 'grupo',
        nombre: null,
        propietarioId: null,
      },
      responsable: {
        id: 'per-1',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        deletedAt: null,
        tipo: 'externo',
        nombre: 'Ana',
        estado: 'activo',
        email: null,
        emailVerified: false,
        contacto: null,
        notas: null,
      },
      personaAReembolsar: null,
    });
    expect(movimiento.caja?.tipo).toBe('grupo');
    expect(movimiento.responsable?.nombre).toBe('Ana');
  });

  it('rechaza un concepto desconocido', () => {
    expect(
      movimientoSchema.safeParse({
        ...MOVIMIENTO_FIXTURE,
        concepto: 'cuota_grupo',
      }).success,
    ).toBe(false);
  });

  it('paginado, transferencia y pendientes agrupados', () => {
    const meta = {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    };
    expect(
      movimientosPaginatedSchema.parse({ data: [MOVIMIENTO_FIXTURE], meta })
        .data,
    ).toHaveLength(1);
    expect(
      transferenciaResultSchema.parse({
        egreso: MOVIMIENTO_FIXTURE,
        ingreso: MOVIMIENTO_FIXTURE,
      }).egreso.monto,
    ).toBe(1500.5);
    const [grupo] = pendientesPorPersonaSchema.parse([
      {
        personaId: 'p',
        personaNombre: 'Ana',
        totalPendiente: 10,
        movimientos: [MOVIMIENTO_FIXTURE],
      },
    ]);
    expect(grupo?.totalPendiente).toBe(10);
  });
});

describe('filterMovimientos (port de movimiento-filter.util.spec.ts)', () => {
  const ingreso = {
    id: 'i1',
    tipo: 'ingreso',
    concepto: 'evento_venta_ingreso',
  } as const;
  const recupero = {
    id: 'i2',
    tipo: 'ingreso',
    concepto: 'evento_venta_recupero_costo',
  } as const;
  const gasto = {
    id: 'e1',
    tipo: 'egreso',
    concepto: 'evento_venta_gasto',
  } as const;
  const usoSaldo = {
    id: 'e2',
    tipo: 'egreso',
    concepto: 'uso_saldo_personal',
  } as const;
  const todos = [ingreso, recupero, gasto, usoSaldo];

  it('TODOS devuelve todos (copia nueva)', () => {
    const result = filterMovimientos(todos, FILTRO_MOVIMIENTOS.TODOS);
    expect(result).toEqual(todos);
    expect(result).not.toBe(todos);
  });

  it('INGRESOS devuelve solo ingresos', () => {
    expect(filterMovimientos(todos, FILTRO_MOVIMIENTOS.INGRESOS)).toEqual([
      ingreso,
      recupero,
    ]);
  });

  it('EGRESOS incluye uso_saldo_personal', () => {
    expect(filterMovimientos(todos, FILTRO_MOVIMIENTOS.EGRESOS)).toEqual([
      gasto,
      usoSaldo,
    ]);
  });

  it('GASTOS excluye uso_saldo_personal', () => {
    expect(filterMovimientos(todos, FILTRO_MOVIMIENTOS.GASTOS)).toEqual([
      gasto,
    ]);
  });
});
