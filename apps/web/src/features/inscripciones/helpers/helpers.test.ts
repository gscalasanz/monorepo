import {
  inscripcionSchema,
  inscripcionesConsolidadoSchema,
  type Inscripcion,
} from '@/shared/domain';
import { INSCRIPCION_RESPONSE_FIXTURE } from '@/shared/domain/testing/fixtures';
import {
  cobradoPercent,
  debtorCategories,
  financialMetrics,
  ramaShares,
} from '@/features/inscripciones/helpers/consolidado';
import {
  applyPersonaNueva,
  applyTipo,
  buildCreateDto,
  fondoInsuficiente,
  initialCreateValues,
  montoAPagarCreate,
  montosExcedenTotal,
  saldoPersonalExcedido,
  withSaldoPersonalVisible,
  usarTodoSaldo,
  validateCreate,
} from '@/features/inscripciones/helpers/create-form';
import {
  authSummary,
  isPagoEditable,
  mergeInscripcion,
  montoAPagar,
  progressPercent,
  progressTone,
} from '@/features/inscripciones/helpers/detail';
import {
  ALL_YEARS,
  dashboardSearch,
  filtersToQuery,
  filtersToSearch,
  fromFilterValues,
  parseFilters,
  toFilterValues,
} from '@/features/inscripciones/helpers/filters';
import {
  filterBySearch,
  missingAutorizaciones,
} from '@/features/inscripciones/helpers/list';
import {
  buildPagoDto,
  summarizeBonificar,
  summarizePagoCreate,
  summarizePagoEdit,
  usarTodoPago,
} from '@/features/inscripciones/helpers/pago';

const YEAR = 2026;
const INSCRIPCION: Inscripcion = inscripcionSchema.parse(
  INSCRIPCION_RESPONSE_FIXTURE,
);
const params = (query: string) => new URLSearchParams(query);
const montoFor = (tipo: string) => (tipo === 'scout_argentina' ? 1000 : 500);

describe('filtros ↔ URL', () => {
  it('defaults: SA, año actual, sin deuda ni rama', () => {
    expect(parseFilters(params(''), YEAR)).toEqual({
      tipo: 'scout_argentina',
      ano: YEAR,
      tipoDeuda: null,
      rama: null,
    });
  });

  it('lee tipo, año, tipoDeuda y rama válidos; ignora inválidos', () => {
    expect(
      parseFilters(
        params('tipo=grupo&ano=2025&tipoDeuda=dinero&rama=educador'),
        YEAR,
      ),
    ).toEqual({
      tipo: 'grupo',
      ano: 2025,
      tipoDeuda: 'dinero',
      rama: 'educador',
    });
    expect(
      parseFilters(params('tipo=x&tipoDeuda=y&rama=z&ano=todos'), YEAR),
    ).toEqual({
      tipo: 'scout_argentina',
      ano: null,
      tipoDeuda: null,
      rama: null,
    });
  });

  it('serializa omitiendo el año actual y mapea a la query del backend', () => {
    const filters = {
      tipo: 'grupo',
      ano: YEAR,
      tipoDeuda: 'ambos',
      rama: 'Manada',
    } as const;
    expect(filtersToSearch(filters, YEAR)).toBe(
      'tipo=grupo&tipoDeuda=ambos&rama=Manada',
    );
    expect(filtersToSearch({ ...filters, ano: null }, YEAR)).toContain(
      `ano=${ALL_YEARS}`,
    );
    expect(filtersToQuery({ ...filters, ano: null })).toEqual({
      tipo: 'grupo',
      ano: undefined,
      tipoDeuda: 'ambos',
      rama: 'Manada',
    });
    expect(dashboardSearch(filters)).toBe('tipoDeuda=ambos&rama=Manada');
  });

  it('FilterBar ida y vuelta; "Limpiar" vuelve al año actual', () => {
    const filters = {
      tipo: 'scout_argentina',
      ano: 2025,
      tipoDeuda: 'documentacion',
      rama: null,
    } as const;
    const values = toFilterValues(filters, 'ana');
    expect(
      fromFilterValues(values, { tipo: 'scout_argentina', currentYear: YEAR }),
    ).toEqual({ filters, search: 'ana' });
    expect(
      fromFilterValues({}, { tipo: 'grupo', currentYear: YEAR }).filters,
    ).toEqual({
      tipo: 'grupo',
      ano: YEAR,
      tipoDeuda: null,
      rama: null,
    });
  });
});

describe('lista', () => {
  it('busca por nombre sin distinguir mayúsculas', () => {
    expect(filterBySearch([INSCRIPCION], 'JUA')).toHaveLength(1);
    expect(filterBySearch([INSCRIPCION], 'pedro')).toHaveLength(0);
    expect(filterBySearch([INSCRIPCION], '  ')).toHaveLength(1);
  });

  it('lista los papeles que faltan con su nombre corto, en el orden de Angular', () => {
    const faltan = missingAutorizaciones({
      ...INSCRIPCION,
      declaracionDeSalud: true,
      autorizacionDeImagen: false,
      salidasCercanas: true,
      autorizacionIngreso: false,
      certificadoAptitudFisica: true,
    });
    expect(faltan).toEqual(['Imagen', 'Ingreso']);
  });

  it('con todos los papeles no falta ninguno', () => {
    const completos = {
      declaracionDeSalud: true,
      autorizacionDeImagen: true,
      salidasCercanas: true,
      autorizacionIngreso: true,
      certificadoAptitudFisica: true,
    };
    expect(missingAutorizaciones(completos)).toEqual([]);
  });
});

describe('consolidado', () => {
  const porRama = {
    total: 4,
    manada: 2,
    unidad: 1,
    caminantes: 0,
    rovers: 0,
    educadores: 1,
  };
  const consolidado = inscripcionesConsolidadoSchema.parse({
    filtros: {},
    total: 4,
    porRama,
    financiero: {
      montoEsperado: 1000,
      montoPagado: 250,
      montoAdeudado: 750,
      montoBonificado: 2000,
    },
    deudores: {
      dinero: { total: 3, monto: 750, porRama },
      documentacion: {
        total: 0,
        porRama: { ...porRama, manada: 0, unidad: 0, educadores: 0 },
      },
      ambos: porRama,
    },
    fecha: '2026-03-13T15:00:00.000Z',
  });

  it('reparte por rama con %', () => {
    const shares = ramaShares({ porRama, total: 4 });
    expect(
      shares.map((share) => [share.label, share.count, share.percentage]),
    ).toEqual([
      ['Manada', 2, 50],
      ['Unidad', 1, 25],
      ['Caminantes', 0, 0],
      ['Rovers', 0, 0],
      ['Educadores', 1, 25],
    ]);
  });

  it('% sobre el esperado con tope 100 y % cobrado', () => {
    const metrics = financialMetrics(consolidado.financiero);
    expect(metrics.map((metric) => metric.percentage)).toEqual([
      null,
      25,
      75,
      100,
    ]);
    expect(cobradoPercent(consolidado.financiero)).toBe(25);
    expect(
      cobradoPercent({ ...consolidado.financiero, montoEsperado: 0 }),
    ).toBe(0);
  });

  it('deudores con desglose solo de ramas >0', () => {
    const [dinero, documentacion] = debtorCategories(consolidado.deudores);
    expect(dinero?.monto).toBe(750);
    expect(dinero?.breakdown).toEqual([
      { label: 'Manada', count: 2 },
      { label: 'Unidad', count: 1 },
      { label: 'Educadores', count: 1 },
    ]);
    expect(documentacion?.breakdown).toEqual([]);
  });
});

describe('form de alta', () => {
  const base = initialCreateValues({
    tipo: 'scout_argentina',
    ano: YEAR,
    montoFor,
  });

  it('monto total desde la config y cambios de tipo', () => {
    expect(base.montoTotal).toBe(1000);
    const conDocs = { ...base, declaracionDeSalud: true, personaNueva: true };
    const grupo = applyTipo(conDocs, { tipo: 'grupo', montoFor });
    expect(grupo).toMatchObject({
      tipo: 'grupo',
      montoTotal: 500,
      personaNueva: false,
      declaracionDeSalud: false,
    });
  });

  it('persona nueva pone todo en 0 y al destildar vuelve el monto', () => {
    const nueva = applyPersonaNueva(
      { ...base, montoPagado: 100, montoBonificado: 50 },
      { esNueva: true, montoFor },
    );
    expect(nueva).toMatchObject({
      montoTotal: 0,
      montoPagado: 0,
      montoBonificado: 0,
      montoConSaldoPersonal: 0,
    });
    expect(
      applyPersonaNueva(nueva, { esNueva: false, montoFor }).montoTotal,
    ).toBe(1000);
  });

  it('saldo personal: se descarta si la persona no tiene saldo y no puede superarlo', () => {
    const values = { ...base, montoConSaldoPersonal: 300 };
    expect(
      withSaldoPersonalVisible(values, 0).montoConSaldoPersonal,
    ).toBeNull();
    expect(withSaldoPersonalVisible(values, 500)).toBe(values);
    expect(saldoPersonalExcedido(values, 200)).toBe(true);
    expect(saldoPersonalExcedido(values, 300)).toBe(false);
  });

  it('valida suma de importes, fondo y requeridos', () => {
    const values = {
      ...base,
      montoPagado: 600,
      montoConSaldoPersonal: 300,
      montoBonificado: 200,
    };
    expect(montosExcedenTotal(values)).toBe(true);
    expect(montosExcedenTotal({ ...values, montoBonificado: 100 })).toBe(false);
    expect(fondoInsuficiente(values, 100)).toBe(true);
    expect(montoAPagarCreate(values)).toBe(500);
    expect(usarTodoSaldo(5000, 1000)).toBe(1000);
    expect(validateCreate({ ...base, ano: 2019 })).toEqual({
      personaId: 'Selecciona una persona',
      ano: 'Ingresá un año entre 2020 y 2100',
    });
  });

  it('DTO como Angular: omite ceros, medio solo con pago, booleans solo true', () => {
    const dto = buildCreateDto({
      ...base,
      personaId: 'p1',
      ano: YEAR,
      montoPagado: 0,
      salidasCercanas: true,
    });
    expect(dto).toEqual({
      personaId: 'p1',
      tipo: 'scout_argentina',
      ano: YEAR,
      montoTotal: 1000,
      montoPagado: undefined,
      montoConSaldoPersonal: undefined,
      medioPago: undefined,
      montoBonificado: undefined,
      salidasCercanas: true,
    });
    expect(
      buildCreateDto({ ...base, personaId: 'p1', ano: YEAR, montoPagado: 10 })
        .medioPago,
    ).toBe('efectivo');
  });
});

describe('detalle', () => {
  it('avance de pago y tono', () => {
    expect(montoAPagar(INSCRIPCION)).toBe(30000);
    expect(progressPercent(INSCRIPCION)).toBe(33);
    expect(
      progressPercent({
        montoTotal: 100,
        montoBonificado: 100,
        montoPagado: 0,
      }),
    ).toBe(100);
    expect(progressTone(INSCRIPCION)).toBe('partial');
    expect(progressTone({ saldoPendiente: 0, montoPagado: 0 })).toBe('success');
  });

  it('autorizaciones pendientes', () => {
    expect(authSummary(INSCRIPCION)).toEqual({
      complete: false,
      pending: 3,
      total: 5,
    });
  });

  it('solo los ingresos de inscripción son editables', () => {
    expect(
      isPagoEditable({ tipo: 'ingreso', concepto: 'inscripcion_grupo' }),
    ).toBe(true);
    expect(
      isPagoEditable({ tipo: 'egreso', concepto: 'inscripcion_grupo' }),
    ).toBe(false);
    expect(
      isPagoEditable({ tipo: 'ingreso', concepto: 'campamento_pago' }),
    ).toBe(false);
  });

  it('conserva la persona si la respuesta no la trae', () => {
    const sinPersona = { ...INSCRIPCION, persona: undefined, montoPagado: 1 };
    expect(mergeInscripcion(INSCRIPCION, sinPersona).persona?.nombre).toBe(
      'Juan',
    );
  });
});

describe('diálogos de pago y bonificación', () => {
  const values = {
    montoPagado: 100,
    montoConSaldoPersonal: 50,
    medioPago: 'efectivo',
    descripcion: '',
  } as const;

  it('registrar pago: total, restante y límites', () => {
    expect(
      summarizePagoCreate(values, { pendiente: 200, saldoPersonal: 100 }),
    ).toEqual({
      total: 150,
      restante: 50,
      excedePendiente: false,
      excedeSaldo: false,
      invalid: false,
    });
    expect(
      summarizePagoCreate(values, { pendiente: 120, saldoPersonal: 10 }),
    ).toMatchObject({
      excedePendiente: true,
      excedeSaldo: true,
      invalid: true,
    });
    expect(
      summarizePagoCreate(
        { ...values, montoPagado: 0, montoConSaldoPersonal: 0 },
        { pendiente: 1, saldoPersonal: 0 },
      ).invalid,
    ).toBe(true);
    expect(
      usarTodoPago(values, { pendiente: 80, saldoPersonal: 500 }),
    ).toMatchObject({ montoPagado: 0, montoConSaldoPersonal: 80 });
    expect(
      buildPagoDto({ ...values, montoConSaldoPersonal: 0, descripcion: ' ' }),
    ).toEqual({
      montoPagado: 100,
      montoConSaldoPersonal: undefined,
      medioPago: 'efectivo',
      descripcion: undefined,
    });
  });

  it('editar pago: máximo = pendiente + original, mínimo 1', () => {
    expect(
      summarizePagoEdit(
        { monto: 300, medioPago: 'efectivo', descripcion: '' },
        { pendiente: 100, original: 200 },
      ),
    ).toMatchObject({ max: 300, restante: 0, invalid: false });
    expect(
      summarizePagoEdit(
        { monto: 0, medioPago: 'efectivo', descripcion: '' },
        { pendiente: 100, original: 200 },
      ).belowMin,
    ).toBe(true);
    expect(
      summarizePagoEdit(
        { monto: 301, medioPago: 'efectivo', descripcion: '' },
        { pendiente: 100, original: 200 },
      ).aboveMax,
    ).toBe(true);
  });

  it('bonificar compara el delta contra el fondo', () => {
    const context = {
      montoTotal: 1000,
      bonificadoActual: 500,
      saldoFondo: 100,
    };
    expect(summarizeBonificar(600, context)).toEqual({
      excedeTotal: false,
      saldoInsuficiente: false,
      canConfirm: true,
    });
    expect(summarizeBonificar(700, context).saldoInsuficiente).toBe(true);
    expect(
      summarizeBonificar(1001, { ...context, saldoFondo: 10000 }).excedeTotal,
    ).toBe(true);
    expect(summarizeBonificar(null, context).canConfirm).toBe(false);
  });
});
