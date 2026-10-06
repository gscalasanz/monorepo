import {
  campamentoDetalleSchema,
  personaSchema,
  type CampamentoKpis,
  type ParticipantePago,
} from '@/shared/domain';
import {
  EDUCADOR_FIXTURE,
  PROTAGONISTA_FIXTURE,
} from '@/shared/domain/testing/fixtures';
import { asLocalDate, msFromInstant, resolveBackendDate } from '@/shared/time';
import {
  INITIAL_AGREGAR_DRAFT,
  agregarState,
  montoMaximoPara,
  personaLabel,
  personasDisponibles,
  toInscripcionPlan,
} from '@/features/campamentos/helpers/agregar-participante';
import {
  bonificarAction,
  bonificarState,
} from '@/features/campamentos/helpers/bonificar';
import {
  campStats,
  campStatus,
  cardBadge,
  daysUntil,
} from '@/features/campamentos/helpers/camp-status';
import {
  EMPTY_CAMPAMENTO_DRAFT,
  campamentoFormSchema,
  toCampamentoDto,
} from '@/features/campamentos/helpers/campamento-form';
import {
  isPagoGestionable,
  participanteAcciones,
  participanteEstado,
  recaudacionPercent,
} from '@/features/campamentos/helpers/detalle';
import {
  applyClientFilter,
  buildDetalleQuery,
  nextParticipantesFilter,
} from '@/features/campamentos/helpers/detalle-query';
import {
  INITIAL_PAGO_DRAFT,
  pagarTodoMixto,
  pagoSummary,
  soloEfectivo,
  soloSaldo,
  toPagoDto,
} from '@/features/campamentos/helpers/pago';

const d = asLocalDate;
const TS = '2026-03-13T15:00:00.000Z';

const PARTICIPANTE: ParticipantePago =
  campamentoDetalleSchema.shape.participantes.element.parse({
    id: 'per-1',
    nombre: 'Juan',
    tipo: 'protagonista',
    rama: 'Manada',
    montoAsignado: 45000,
    montoBonificado: 0,
    totalPagado: 15000,
    saldoPendiente: 30000,
    estadoPago: 'parcial',
    saldoCuentaPersonal: 0,
    autorizacionEntregada: false,
    fechaInscripcion: TS,
    pagos: [],
  });

describe('estado temporal del campamento', () => {
  const camp = { fechaInicio: d('2026-10-10'), fechaFin: d('2026-10-12') };

  it('próximo / en curso (bordes inclusive) / finalizado', () => {
    expect(campStatus(camp, d('2026-10-09'))).toBe('upcoming');
    expect(campStatus(camp, d('2026-10-10'))).toBe('active');
    expect(campStatus(camp, d('2026-10-12'))).toBe('active');
    expect(campStatus(camp, d('2026-10-13'))).toBe('past');
  });

  it('días restantes con ceil desde ahora; null si ya empezó', () => {
    const start = resolveBackendDate('2026-10-10');
    const startMs = start ? msFromInstant(start) : 0;
    const hour = 60 * 60 * 1000;
    expect(daysUntil(d('2026-10-10'), startMs - 30 * hour)).toBe(2);
    expect(daysUntil(d('2026-10-10'), startMs + hour)).toBeNull();
  });

  it('stats por estado y badge de la card', () => {
    const today = d('2026-10-11');
    expect(
      campStats(
        [
          camp,
          { ...camp, fechaInicio: d('2026-12-01'), fechaFin: d('2026-12-02') },
        ],
        today,
      ),
    ).toEqual({
      total: 2,
      upcoming: 1,
      active: 1,
      past: 0,
    });
    expect(cardBadge({ camp, today, nowMs: 0 }).kind).toBe('active');
    expect(cardBadge({ camp, today: d('2026-11-01'), nowMs: 0 }).kind).toBe(
      'past',
    );
  });
});

describe('form de campamento', () => {
  const valid = {
    ...EMPTY_CAMPAMENTO_DRAFT,
    nombre: 'Verano',
    fechaInicio: '2026-01-15',
    fechaFin: '2026-01-15',
    costoPorPersona: 45000,
  };

  it('defaults de Angular (cuotas 1, aporte educadores 0)', () => {
    expect(EMPTY_CAMPAMENTO_DRAFT.cuotasBase).toBe(1);
    expect(EMPTY_CAMPAMENTO_DRAFT.costoEducadores).toBe(0);
  });

  it('mismo día es válido; inicio > fin no', () => {
    expect(campamentoFormSchema.safeParse(valid).success).toBe(true);
    const result = campamentoFormSchema.safeParse({
      ...valid,
      fechaFin: '2026-01-14',
    });
    expect(result.success).toBe(false);
  });

  it('mensajes únicos por campo', () => {
    const result = campamentoFormSchema.safeParse({
      ...valid,
      nombre: 'ab',
      costoPorPersona: 0,
      cuotasBase: 13,
      costoEducadores: -1,
    });
    const messages = result.success
      ? []
      : result.error.issues.map((i) => i.message);
    expect(messages).toEqual(
      expect.arrayContaining([
        'El nombre es requerido',
        'El costo es requerido',
        'Las cuotas deben ser entre 1 y 12',
        'El aporte de educadores no puede ser negativo',
      ]),
    );
  });

  it('DTO: descripción vacía se omite', () => {
    const parsed = campamentoFormSchema.parse(valid);
    expect(toCampamentoDto(parsed)).toEqual({
      nombre: 'Verano',
      fechaInicio: '2026-01-15',
      fechaFin: '2026-01-15',
      costoPorPersona: 45000,
      costoEducadores: 0,
      cuotasBase: 1,
    });
    expect(
      toCampamentoDto({ ...parsed, descripcion: 'Sierra' }).descripcion,
    ).toBe('Sierra');
  });
});

describe('filtros del detalle', () => {
  it('ignora nombres de 1–2 caracteres (conserva el filtro actual)', () => {
    const current = { nombre: 'Juan' };
    expect(nextParticipantesFilter(current, { nombre: 'ju' })).toBe(current);
    expect(
      nextParticipantesFilter(current, { nombre: 'Ana', rama: 'Manada' }),
    ).toEqual({
      nombre: 'Ana',
      rama: 'Manada',
    });
    expect(nextParticipantesFilter(current, {})).toEqual({});
  });

  it('"Educadores" no viaja al backend: se filtra por tipo en el cliente', () => {
    expect(
      buildDetalleQuery({
        id: 'c',
        filtro: 'gastos',
        filter: { rama: 'educador' },
      }),
    ).toEqual({
      id: 'c',
      filtroMovimientos: 'gastos',
    });
    expect(
      buildDetalleQuery({
        id: 'c',
        filtro: 'todos',
        filter: { rama: 'Unidad', nombre: 'Ana' },
      }),
    ).toEqual({
      id: 'c',
      filtroMovimientos: 'todos',
      rama: 'Unidad',
      nombre: 'Ana',
    });
    const educador = { ...PARTICIPANTE, id: 'e', tipo: 'educador' as const };
    expect(
      applyClientFilter([PARTICIPANTE, educador], { rama: 'educador' }),
    ).toEqual([educador]);
    expect(applyClientFilter([PARTICIPANTE], {})).toEqual([PARTICIPANTE]);
  });
});

describe('detalle', () => {
  const kpis = { totalARecaudar: 0, totalRecaudado: 0 } as CampamentoKpis;

  it('recaudación redondeada y topeada en 100', () => {
    expect(recaudacionPercent(kpis)).toBe(0);
    expect(
      recaudacionPercent({ ...kpis, totalARecaudar: 3, totalRecaudado: 1 }),
    ).toBe(33);
    expect(
      recaudacionPercent({ ...kpis, totalARecaudar: 1, totalRecaudado: 5 }),
    ).toBe(100);
  });

  it('estado y acciones del participante', () => {
    expect(participanteEstado(PARTICIPANTE)).toBe('pendiente');
    expect(participanteEstado({ ...PARTICIPANTE, saldoPendiente: 0 })).toBe(
      'al-dia',
    );
    expect(participanteEstado({ ...PARTICIPANTE, estadoPago: 'exento' })).toBe(
      'exento',
    );
    expect(participanteAcciones(PARTICIPANTE)).toEqual({
      registrarPago: true,
      bonificar: true,
      ajustar: false,
      quitarBonificacion: false,
    });
    expect(
      participanteAcciones({
        ...PARTICIPANTE,
        estadoPago: 'exento',
        saldoPendiente: 0,
      }).bonificar,
    ).toBe(false);
  });

  it('solo el pago real de campamento se gestiona desde el historial', () => {
    const pago = {
      movimientoId: 'm',
      fecha: TS,
      monto: 1,
      medioPago: 'efectivo',
      tipo: 'ingreso',
    } as const;
    expect(
      isPagoGestionable({
        ...pago,
        concepto: 'campamento_pago',
      } as ParticipantePago['pagos'][number]),
    ).toBe(true);
    expect(
      isPagoGestionable({
        ...pago,
        concepto: 'bonificacion_recibida',
      } as ParticipantePago['pagos'][number]),
    ).toBe(false);
  });
});

describe('pago mixto', () => {
  const ctx = {
    costoPorPersona: 45000,
    totalPagado: 15000,
    montoPendiente: 30000,
    saldoCuentaPersonal: 10000,
  };

  it('inválido con total 0, total > pendiente, sin medio o saldo excedido', () => {
    expect(pagoSummary(ctx, INITIAL_PAGO_DRAFT).invalid).toBe(true);
    expect(
      pagoSummary(ctx, { ...INITIAL_PAGO_DRAFT, montoPagado: 30001 }).invalid,
    ).toBe(true);
    expect(
      pagoSummary(ctx, {
        ...INITIAL_PAGO_DRAFT,
        montoPagado: 100,
        medioPago: null,
      }).medioFaltante,
    ).toBe(true);
    expect(
      pagoSummary(ctx, { ...INITIAL_PAGO_DRAFT, montoConSaldoPersonal: 10001 })
        .saldoExcedido,
    ).toBe(true);
    expect(
      pagoSummary(ctx, { ...INITIAL_PAGO_DRAFT, montoPagado: 100 }).invalid,
    ).toBe(false);
  });

  it('progreso, restante y atajos', () => {
    const summary = pagoSummary(ctx, {
      ...INITIAL_PAGO_DRAFT,
      montoPagado: 5000,
      montoConSaldoPersonal: 5000,
    });
    expect(summary.progress).toBe(33);
    expect(summary.restante).toBe(20000);
    expect(summary.esMixto).toBe(true);
    expect(pagarTodoMixto(ctx)).toEqual({
      montoConSaldoPersonal: 10000,
      montoPagado: 20000,
    });
    expect(soloSaldo(ctx)).toEqual({ montoConSaldoPersonal: 10000 });
    expect(soloEfectivo(ctx)).toEqual({
      montoPagado: 30000,
      montoConSaldoPersonal: 0,
    });
  });

  it('DTO: medio solo con monto físico; saldo solo si > 0', () => {
    expect(
      toPagoDto(ctx, { ...INITIAL_PAGO_DRAFT, montoConSaldoPersonal: 5000 }),
    ).toEqual({
      montoPagado: 0,
      montoConSaldoPersonal: 5000,
    });
    expect(
      toPagoDto(ctx, {
        ...INITIAL_PAGO_DRAFT,
        montoPagado: 100,
        descripcion: ' cuota ',
      }),
    ).toEqual({
      montoPagado: 100,
      medioPago: 'efectivo',
      descripcion: 'cuota',
    });
  });

  it('sin saldo personal el campo de saldo no cuenta', () => {
    const sinSaldo = { ...ctx, saldoCuentaPersonal: 0 };
    expect(
      pagoSummary(sinSaldo, {
        ...INITIAL_PAGO_DRAFT,
        montoConSaldoPersonal: 999,
      }).montoSaldo,
    ).toBe(0);
  });
});

describe('bonificación', () => {
  const ctx = {
    montoAsignado: 45000,
    montoBonificadoActual: 5000,
    totalPagado: 15000,
    saldoFondo: 1000,
  };

  it('máximo = asignado − pagado; el fondo se compara contra el adicional', () => {
    expect(bonificarState(ctx, 6000)).toMatchObject({
      maxBonificable: 30000,
      adicional: 1000,
      puedeConfirmar: true,
    });
    expect(bonificarState(ctx, 6001).saldoInsuficiente).toBe(true);
    expect(
      bonificarState({ ...ctx, saldoFondo: 1e6 }, 30001).excedeAsignado,
    ).toBe(true);
    expect(bonificarState(ctx, null).puedeConfirmar).toBe(false);
  });

  it('0 quita la bonificación; > 0 fija el total', () => {
    expect(bonificarAction(0)).toEqual({ kind: 'quitar' });
    expect(bonificarAction(5)).toEqual({ kind: 'fijar', monto: 5 });
  });
});

describe('agregar participante', () => {
  const protagonista = personaSchema.parse(PROTAGONISTA_FIXTURE);
  const educador = personaSchema.parse(EDUCADOR_FIXTURE);
  const camp = { costoPorPersona: 45000, costoEducadores: 0 };

  it('excluye inscriptos y filtra por rama', () => {
    const all = [protagonista, educador];
    expect(
      personasDisponibles({ personas: all, excludeIds: [], rama: null }),
    ).toHaveLength(2);
    expect(
      personasDisponibles({
        personas: all,
        excludeIds: [protagonista.id],
        rama: null,
      }),
    ).toEqual([educador]);
    expect(
      personasDisponibles({
        personas: all,
        excludeIds: [],
        rama: 'Rovers',
      }).map((p) => p.id),
    ).not.toContain(educador.id);
  });

  it('label y monto según tipo (educadores usan el aporte)', () => {
    expect(personaLabel(protagonista)).toMatch(/^Juan \(Protagonista/);
    expect(montoMaximoPara(educador, camp)).toBe(0);
    expect(montoMaximoPara(protagonista, camp)).toBe(45000);
    expect(montoMaximoPara(undefined, camp)).toBe(0);
  });

  it('el pago máximo descuenta lo bonificado; plan encadenado', () => {
    const draft = {
      ...INITIAL_AGREGAR_DRAFT,
      personaId: 'p',
      montoBonificado: 5000,
      montoPago: 40001,
    };
    const state = agregarState(draft, 45000);
    expect(state.maxPago).toBe(40000);
    expect(state.pagoExcede).toBe(true);
    expect(state.canSubmit).toBe(false);
    const ok = agregarState({ ...draft, montoPago: 1000 }, 45000);
    expect(toInscripcionPlan({ ...draft, montoPago: 1000 }, ok)).toEqual({
      personaId: 'p',
      autorizacionEntregada: false,
      montoBonificado: 5000,
      pago: { monto: 1000, medioPago: 'efectivo' },
    });
    expect(agregarState({ ...draft, montoPago: 1000 }, 0).montosVisibles).toBe(
      false,
    );
  });
});
