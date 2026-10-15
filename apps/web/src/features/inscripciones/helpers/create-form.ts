/** Reglas puras del form "Nueva Inscripción" (port de `InscripcionFormComponent`). */
import {
  MEDIO_PAGO,
  TIPO_INSCRIPCION,
  type CreateInscripcionDto,
  type MedioPago,
  type TipoInscripcion,
} from '@/shared/domain';
import { FORM_COPY as C } from '@/features/inscripciones/constants/copy';
import {
  ANO_MAX,
  ANO_MIN,
  AUTORIZACION_KEYS,
  EMPTY_AUTORIZACIONES,
  type Autorizaciones,
} from '@/features/inscripciones/constants/inscripciones';

export interface CreateFormValues extends Autorizaciones {
  readonly personaId: string | null;
  readonly tipo: TipoInscripcion;
  readonly ano: number | null;
  readonly personaNueva: boolean;
  /** Deshabilitado: viene de la config (`montoByTipo`) o 0 si es persona nueva. */
  readonly montoTotal: number;
  readonly montoPagado: number | null;
  readonly medioPago: MedioPago;
  readonly montoConSaldoPersonal: number | null;
  readonly montoBonificado: number | null;
}

export type MontoForTipo = (tipo: TipoInscripcion) => number;

export function initialCreateValues(params: {
  readonly tipo: TipoInscripcion;
  readonly ano: number;
  readonly montoFor: MontoForTipo;
}): CreateFormValues {
  return {
    ...EMPTY_AUTORIZACIONES,
    personaId: null,
    tipo: params.tipo,
    ano: params.ano,
    personaNueva: false,
    montoTotal: params.montoFor(params.tipo),
    montoPagado: 0,
    medioPago: MEDIO_PAGO.EFECTIVO,
    montoConSaldoPersonal: 0,
    montoBonificado: 0,
  };
}

const ZERO_AMOUNTS = {
  montoPagado: 0,
  montoConSaldoPersonal: 0,
  montoBonificado: 0,
} as const;

/** Persona nueva: todo en 0 (y bloqueado); al destildar vuelve el monto configurado. */
export function applyPersonaNueva(
  values: CreateFormValues,
  context: { readonly esNueva: boolean; readonly montoFor: MontoForTipo },
): CreateFormValues {
  if (context.esNueva)
    return { ...values, ...ZERO_AMOUNTS, personaNueva: true, montoTotal: 0 };
  return {
    ...values,
    personaNueva: false,
    montoTotal: context.montoFor(values.tipo),
  };
}

/** Cambio de tipo: Grupo limpia autorizaciones y desmarca "Persona nueva"; el monto sale de la config. */
export function applyTipo(
  values: CreateFormValues,
  context: { readonly tipo: TipoInscripcion; readonly montoFor: MontoForTipo },
): CreateFormValues {
  const isGrupo = context.tipo === TIPO_INSCRIPCION.GRUPO;
  const next: CreateFormValues = {
    ...values,
    ...(isGrupo ? EMPTY_AUTORIZACIONES : {}),
    tipo: context.tipo,
    personaNueva: isGrupo ? false : values.personaNueva,
  };
  return {
    ...next,
    montoTotal: next.personaNueva ? 0 : context.montoFor(context.tipo),
  };
}

const amount = (value: number | null): number => value ?? 0;

/** Pago + saldo personal + bonificación > total. */
export function montosExcedenTotal(values: CreateFormValues): boolean {
  const pagos =
    amount(values.montoPagado) +
    amount(values.montoConSaldoPersonal) +
    amount(values.montoBonificado);
  return pagos > values.montoTotal;
}

export function fondoInsuficiente(
  values: CreateFormValues,
  saldoFondo: number,
): boolean {
  return amount(values.montoBonificado) > saldoFondo;
}

/**
 * El monto de saldo personal solo cuenta si la persona tiene saldo: si no, el
 * campo no se muestra y un valor que quedó de otra persona no debe enviarse.
 */
export function withSaldoPersonalVisible(
  values: CreateFormValues,
  saldoPersonal: number,
): CreateFormValues {
  return saldoPersonal > 0
    ? values
    : { ...values, montoConSaldoPersonal: null };
}

export function saldoPersonalExcedido(
  values: CreateFormValues,
  saldoPersonal: number,
): boolean {
  return amount(values.montoConSaldoPersonal) > saldoPersonal;
}

/** Total − saldo personal − bonificación. */
export function montoAPagarCreate(values: CreateFormValues): number {
  return (
    values.montoTotal -
    amount(values.montoConSaldoPersonal) -
    amount(values.montoBonificado)
  );
}

/** "Usar todo →": min(saldo, total). */
export function usarTodoSaldo(saldo: number, montoTotal: number): number {
  return Math.min(saldo, montoTotal);
}

export type CreateFieldErrors = Partial<
  Record<'personaId' | 'tipo' | 'ano', string>
>;

export function validateCreate(values: CreateFormValues): CreateFieldErrors {
  const ano = values.ano;
  const anoError =
    ano === null
      ? C.REQUIRED
      : ano < ANO_MIN || ano > ANO_MAX
        ? C.ANO_RANGE
        : undefined;
  return {
    ...(values.personaId ? {} : { personaId: C.PERSONA_REQUIRED }),
    ...(anoError ? { ano: anoError } : {}),
  };
}

const positiveOrUndefined = (value: number | null): number | undefined =>
  value && value > 0 ? value : undefined;

function trueAutorizaciones(values: Autorizaciones): Partial<Autorizaciones> {
  return Object.fromEntries(
    AUTORIZACION_KEYS.filter((key) => values[key]).map((key) => [key, true]),
  );
}

/** DTO como Angular: montos en 0 se omiten, `medioPago` solo si hay pago, booleans solo si `true`. */
export function buildCreateDto(
  values: CreateFormValues & {
    readonly personaId: string;
    readonly ano: number;
  },
): CreateInscripcionDto {
  const hasPago =
    amount(values.montoPagado) > 0 || amount(values.montoConSaldoPersonal) > 0;
  return {
    personaId: values.personaId,
    tipo: values.tipo,
    ano: values.ano,
    montoTotal: values.montoTotal,
    montoPagado: positiveOrUndefined(values.montoPagado),
    montoConSaldoPersonal: positiveOrUndefined(values.montoConSaldoPersonal),
    medioPago: hasPago ? values.medioPago : undefined,
    montoBonificado: positiveOrUndefined(values.montoBonificado),
    ...trueAutorizaciones(values),
  };
}
