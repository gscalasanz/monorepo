import { collectFieldErrors } from '@/shared/forms';
import { todayBsAs } from '@/shared/time';

import {
  gastoFormSchema,
  initialGastoDraft,
  toGastoDto,
  toGastoEventoDto,
  type GastoFormDraft,
  type GastoFormValues,
} from './gasto-form-schema';
import { withEstadoPago, withResponsable } from './gasto-form-transitions';
import {
  ingresoFormSchema,
  INITIAL_INGRESO_DRAFT,
  toIngresoDto,
} from './ingreso-form-schema';
import { filterMovimientosBy } from './movimiento-filter';

const VALID: GastoFormDraft = {
  monto: 1500.5,
  fecha: '2026-03-13',
  responsableId: 'per-1',
  descripcion: 'Garrafa',
  medioPago: 'efectivo',
  estadoPago: 'pagado',
  personaAReembolsarId: null,
};

function errorsOf(draft: GastoFormDraft): Record<string, string> {
  const result = gastoFormSchema.safeParse(draft);
  return result.success ? {} : collectFieldErrors(result.error);
}

describe('gastoFormSchema', () => {
  it('draft inicial: fecha de hoy en BsAs y estado "pagado"', () => {
    expect(initialGastoDraft()).toMatchObject({
      fecha: todayBsAs(),
      estadoPago: 'pagado',
      monto: null,
    });
  });

  it('vacío: mensajes requeridos exactos de Angular', () => {
    expect(
      errorsOf({ ...initialGastoDraft(), fecha: '', estadoPago: null }),
    ).toEqual({
      monto: 'El monto es requerido',
      fecha: 'La fecha es requerida',
      responsableId: 'Seleccione un responsable',
      descripcion: 'La descripción es requerida',
      medioPago: 'Seleccione un medio de pago',
      estadoPago: 'Seleccione un estado',
    });
  });

  it('monto ≤ 0, descripción > 500 y caracteres peligrosos', () => {
    expect(errorsOf({ ...VALID, monto: 0 }).monto).toBe(
      'Debe ser un número positivo',
    );
    expect(
      errorsOf({ ...VALID, descripcion: 'a'.repeat(501) }).descripcion,
    ).toBe('Máximo 500 caracteres');
    expect(errorsOf({ ...VALID, descripcion: '<script>' }).descripcion).toMatch(
      /No se permiten/,
    );
  });

  it('pendiente de reembolso exige persona a reembolsar', () => {
    expect(errorsOf({ ...VALID, estadoPago: 'pendiente_reembolso' })).toEqual({
      personaAReembolsarId: 'Seleccione la persona que adelantó el dinero',
    });
    expect(
      errorsOf({
        ...VALID,
        estadoPago: 'pendiente_reembolso',
        personaAReembolsarId: 'per-2',
      }),
    ).toEqual({});
  });
});

describe('toGastoDto / toGastoEventoDto', () => {
  const values: GastoFormValues = gastoFormSchema.parse(VALID);

  it('campamentos: incluye fecha y omite la persona si está pagado', () => {
    expect(toGastoDto({ ...values, personaAReembolsarId: 'per-2' })).toEqual({
      monto: 1500.5,
      descripcion: 'Garrafa',
      responsableId: 'per-1',
      medioPago: 'efectivo',
      estadoPago: 'pagado',
      fecha: '2026-03-13',
    });
  });

  it('eventos: sin fecha (el back la rechaza) y con persona si está pendiente', () => {
    const dto = toGastoEventoDto({
      ...values,
      estadoPago: 'pendiente_reembolso',
      personaAReembolsarId: 'per-2',
    });
    expect(dto).not.toHaveProperty('fecha');
    expect(dto).toMatchObject({
      estadoPago: 'pendiente_reembolso',
      personaAReembolsarId: 'per-2',
    });
  });
});

describe('transiciones de persona a reembolsar', () => {
  it('al pasar a pendiente precarga el responsable; al volver a pagado se limpia', () => {
    const pendiente = withEstadoPago(VALID, 'pendiente_reembolso');
    expect(pendiente.personaAReembolsarId).toBe('per-1');
    expect(withEstadoPago(pendiente, 'pagado').personaAReembolsarId).toBeNull();
  });

  it('sigue al responsable salvo elección manual', () => {
    const pendiente = withEstadoPago(VALID, 'pendiente_reembolso');
    expect(withResponsable(pendiente, 'per-3').personaAReembolsarId).toBe(
      'per-3',
    );
    const manual = { ...pendiente, personaAReembolsarId: 'per-9' };
    expect(withResponsable(manual, 'per-3').personaAReembolsarId).toBe('per-9');
  });

  it('no muta el draft original', () => {
    const draft = { ...VALID };
    withEstadoPago(draft, 'pendiente_reembolso');
    expect(draft).toEqual(VALID);
  });
});

describe('ingresoFormSchema', () => {
  it('requeridos y DTO', () => {
    expect(ingresoFormSchema.safeParse(INITIAL_INGRESO_DRAFT).success).toBe(
      false,
    );
    const values = ingresoFormSchema.parse({
      monto: 750.5,
      descripcion: 'Venta de rifas',
      responsableId: 'per-1',
      medioPago: 'mixto',
    });
    expect(toIngresoDto(values)).toEqual({
      monto: 750.5,
      descripcion: 'Venta de rifas',
      responsableId: 'per-1',
      medioPago: 'mixto',
    });
  });
});

describe('filterMovimientosBy', () => {
  const movimientos = [
    { id: '1', tipo: 'ingreso', concepto: 'evento_ingreso' },
    { id: '2', tipo: 'egreso', concepto: 'evento_gasto' },
    { id: '3', tipo: 'egreso', concepto: 'uso_saldo_personal' },
  ];
  const isGasto = (m: (typeof movimientos)[number]) =>
    m.tipo === 'egreso' && m.concepto !== 'uso_saldo_personal';

  it.each([
    ['todos', ['1', '2', '3']],
    ['ingresos', ['1']],
    ['egresos', ['2', '3']],
    ['gastos', ['2']],
  ] as const)('%s', (filtro, ids) => {
    const result = filterMovimientosBy({ movimientos, filtro, isGasto });
    expect(result.map((m) => m.id)).toEqual(ids);
    expect(result).not.toBe(movimientos);
  });
});
