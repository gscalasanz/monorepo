import {
  cajaResponseSchema,
  movimientoSchema,
  personaSchema,
  type Movimiento,
} from '@/shared/domain';
import {
  CAJA_RESPONSE_FIXTURE,
  EDUCADOR_FIXTURE,
  MOVIMIENTO_FIXTURE,
  PROTAGONISTA_FIXTURE,
} from '@/shared/domain/testing/fixtures';
import {
  conceptoForTipo,
  editPersonas,
  initialCreateValues,
  initialEditValues,
  toCreateDto,
  toUpdateDto,
} from '@/features/movimientos/helpers/form-mappers';
import { estadoPagoOptions } from '@/features/movimientos/helpers/form-options';
import {
  applyCreateChange,
  applyEstadoChange,
  reembolsoError,
  withReembolsoError,
} from '@/features/movimientos/helpers/form-transitions';
import {
  listQuery,
  listQueryKey,
  listStateFromParams,
} from '@/features/movimientos/helpers/list-params';
import {
  cajaText,
  comprobanteText,
  emptyHint,
  toCardData,
  responsableText,
} from '@/features/movimientos/helpers/view-model';
import { movimientoCreateSchema } from '@/features/movimientos/models/form-schemas';

const params = (query: string) => new URLSearchParams(query);
const MOV: Movimiento = movimientoSchema.parse(MOVIMIENTO_FIXTURE);
const CAJA = cajaResponseSchema.parse({
  ...CAJA_RESPONSE_FIXTURE,
  id: 'caja-1',
  tipo: 'grupo',
  nombre: 'Caja de Grupo',
});

describe('list-params', () => {
  it('estado por defecto: tab todos, 25 por página, página 1', () => {
    const state = listStateFromParams(params(''));
    expect(state).toEqual({
      tab: '',
      filters: {},
      fixed: {},
      pageIndex: 0,
      pageSize: 25,
    });
    expect(listQuery(state)).toMatchObject({
      page: 1,
      limit: 25,
      tipo: undefined,
    });
  });

  it('respeta cajaId, tipoCaja, tipo, concepto y fechas de la URL', () => {
    const state = listStateFromParams(
      params(
        'cajaId=c1&tipoCaja=rama_manada,xx,rama_unidad&tipo=egreso&concepto=gasto_general&fechaInicio=2026-01-01&fechaFin=2026-01-31',
      ),
    );
    expect(state.tab).toBe('egreso');
    expect(listQuery(state)).toEqual({
      page: 1,
      limit: 25,
      cajaId: 'c1',
      tipoCaja: 'rama_manada,rama_unidad',
      tipo: 'egreso',
      concepto: 'gasto_general',
      estadoPago: undefined,
      // Días BsAs completos: la URL guarda fechas, el backend recibe instantes.
      fechaInicio: '2026-01-01T03:00:00.000Z',
      fechaFin: '2026-02-01T02:59:59.999Z',
    });
  });

  it('respeta estadoPago de la URL (los links de pendientes del dashboard)', () => {
    const state = listStateFromParams(params('tipo=egreso&estadoPago=pendiente_reembolso'));
    expect(listQuery(state)).toMatchObject({ tipo: 'egreso', estadoPago: 'pendiente_reembolso' });
  });

  it('descarta un estadoPago inválido de la URL', () => {
    expect(listStateFromParams(params('estadoPago=otro')).filters).toEqual({});
  });

  it('descarta valores inválidos de la URL', () => {
    const state = listStateFromParams(
      params(
        'tipo=otro&concepto=cuota_grupo&fechaInicio=2026-02-30&tipoCaja=nada',
      ),
    );
    expect(state).toMatchObject({ tab: '', filters: {}, fixed: {} });
  });

  it('la key cambia con filtros y página', () => {
    const base = listStateFromParams(params(''));
    const next = { ...base, pageIndex: 2, filters: { estadoPago: 'pagado' } };
    expect(listQueryKey(base)).not.toBe(listQueryKey(next));
    expect(listQuery(next)).toMatchObject({ page: 3, estadoPago: 'pagado' });
  });
});

describe('view-model', () => {
  it('adapta el movimiento a la card/badge compartidos', () => {
    expect(toCardData({ ...MOV, responsable: personaSchema.parse(EDUCADOR_FIXTURE) })).toMatchObject({
      id: 'mov-1',
      estadoPago: 'pagado',
      monto: 1500.5,
      responsableNombre: 'Laura',
    });
  });

  it('textos de celdas con "-" y Sí/No', () => {
    expect(cajaText(MOV)).toBe('-');
    expect(responsableText(MOV)).toBe('-');
    expect(comprobanteText(MOV)).toBe('No');
    expect(comprobanteText({ ...MOV, comprobanteEntregado: true })).toBe('Sí');
  });

  it('pista del vacío según tab', () => {
    expect(emptyHint('ingreso')).toBe(
      'No hay ingresos registrados con los filtros seleccionados.',
    );
    expect(emptyHint('')).toBe(
      'No hay movimientos registrados con los filtros seleccionados.',
    );
  });
});

describe('form-mappers', () => {
  it('valores iniciales: defaults de Angular y ?cajaId solo si existe', () => {
    const values = initialCreateValues({
      cajas: [CAJA],
      cajaId: 'caja-1',
      today: '2026-10-06',
    });
    expect(values).toMatchObject({
      cajaId: 'caja-1',
      tipo: 'ingreso',
      medioPago: 'efectivo',
      estadoPago: 'pagado',
      fecha: '2026-10-06',
    });
    expect(
      initialCreateValues({
        cajas: [CAJA],
        cajaId: 'otra',
        today: '2026-10-06',
      }).cajaId,
    ).toBeNull();
  });

  it('concepto se limpia si no pertenece al tipo', () => {
    expect(
      conceptoForTipo({ concepto: 'ajuste_inicial', tipo: 'egreso' }),
    ).toBe('ajuste_inicial');
    expect(
      conceptoForTipo({ concepto: 'gasto_general', tipo: 'ingreso' }),
    ).toBeNull();
  });

  it('DTO de alta con requiereComprobante false y opcionales omitidos', () => {
    const values = {
      ...initialCreateValues({
        cajas: [CAJA],
        cajaId: 'caja-1',
        today: '2026-10-06',
      }),
      monto: 1,
      concepto: 'ajuste_inicial' as const,
      responsableId: 'per-1',
      descripcion: '  ',
    };
    const parsed = movimientoCreateSchema.parse(values);
    expect(toCreateDto(parsed)).toEqual({
      cajaId: 'caja-1',
      tipo: 'ingreso',
      monto: 1,
      concepto: 'ajuste_inicial',
      categoria: undefined,
      descripcion: undefined,
      responsableId: 'per-1',
      medioPago: 'efectivo',
      requiereComprobante: false,
      estadoPago: 'pagado',
      personaAReembolsarId: undefined,
      fecha: '2026-10-06',
    });
  });

  it('schema de alta: requeridos con el copy de Angular', () => {
    const values = initialCreateValues({
      cajas: [],
      cajaId: null,
      today: '2026-10-06',
    });
    const result = movimientoCreateSchema.safeParse(values);
    const messages = result.success
      ? []
      : result.error.issues.map((issue) => issue.message);
    expect(messages).toEqual(
      expect.arrayContaining([
        'La caja es requerida',
        'El monto es requerido',
        'El concepto es requerido',
        'El responsable es requerido',
      ]),
    );
  });

  it('edición: valores iniciales y DTO', () => {
    const values = initialEditValues(MOV);
    expect(values).toEqual({
      descripcion: 'Garrafa',
      estadoPago: 'pagado',
      personaAReembolsarId: null,
      comprobanteEntregado: false,
    });
    expect(toUpdateDto({ ...values, comprobanteEntregado: true })).toEqual({
      descripcion: 'Garrafa',
      comprobanteEntregado: true,
      estadoPago: 'pagado',
      personaAReembolsarId: undefined,
    });
  });

  it('personas de edición: agrega la persona a reembolsar deshabilitada', () => {
    const activa = personaSchema.parse(EDUCADOR_FIXTURE);
    const inactiva = personaSchema.parse({
      ...PROTAGONISTA_FIXTURE,
      estado: 'inactivo',
    });
    const movimiento = { ...MOV, personaAReembolsar: inactiva };
    expect(
      editPersonas({ personas: [activa], movimiento }).map((p) => p.id),
    ).toEqual(['per-2', 'per-1']);
    expect(editPersonas({ personas: [activa], movimiento: MOV })).toHaveLength(
      1,
    );
  });
});

describe('form-transitions', () => {
  const base = initialCreateValues({
    cajas: [CAJA],
    cajaId: 'caja-1',
    today: '2026-10-06',
  });

  it('cambiar tipo limpia un concepto ajeno', () => {
    const egreso = applyCreateChange(
      { ...base, concepto: 'evento_grupo_ingreso' },
      { name: 'tipo', value: 'egreso' },
    );
    expect(egreso.concepto).toBeNull();
  });

  it('pendiente de reembolso precarga y sigue al responsable salvo elección manual', () => {
    const withResp = applyCreateChange(base, {
      name: 'responsableId',
      value: 'r1',
    });
    const pendiente = applyCreateChange(withResp, {
      name: 'estadoPago',
      value: 'pendiente_reembolso',
    });
    expect(pendiente.personaAReembolsarId).toBe('r1');
    const follows = applyCreateChange(pendiente, {
      name: 'responsableId',
      value: 'r2',
    });
    expect(follows.personaAReembolsarId).toBe('r2');
    const manual = applyCreateChange(follows, {
      name: 'personaAReembolsarId',
      value: 'p9',
    });
    expect(
      applyCreateChange(manual, { name: 'responsableId', value: 'r3' })
        .personaAReembolsarId,
    ).toBe('p9');
    expect(
      applyCreateChange(manual, { name: 'estadoPago', value: 'pagado' })
        .personaAReembolsarId,
    ).toBeNull();
  });

  it('edición: estado con responsable fijo', () => {
    const values = initialEditValues(MOV);
    expect(
      applyEstadoChange({
        values,
        estadoPago: 'pendiente_reembolso',
        responsableId: 'per-1',
      }).personaAReembolsarId,
    ).toBe('per-1');
  });

  it('error de persona a reembolsar solo si falta y se pidió mostrar', () => {
    const values = {
      estadoPago: 'pendiente_reembolso' as const,
      personaAReembolsarId: null,
    };
    expect(reembolsoError(values)).toBe(
      'Seleccione la persona que adelantó el dinero',
    );
    expect(
      withReembolsoError({ errors: {}, values, show: false })
        .personaAReembolsarId,
    ).toBeUndefined();
    expect(
      withReembolsoError({ errors: {}, values, show: true })
        .personaAReembolsarId,
    ).toBeDefined();
  });

  it('opciones de estado: agrega el estado original si no es de los del form', () => {
    expect(estadoPagoOptions().map((o) => o.value)).toEqual([
      'pagado',
      'pendiente_reembolso',
    ]);
    expect(estadoPagoOptions('pendiente_cobro').map((o) => o.label)).toEqual([
      'Pagado',
      'Pendiente de Reembolso',
      'A cobrar',
    ]);
  });
});
