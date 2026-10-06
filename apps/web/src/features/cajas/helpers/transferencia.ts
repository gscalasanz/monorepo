/** Lógica pura del `TransferenciaDialog` (origen fijo: caja de grupo). */
import type { FieldOption } from '@/shared/components/ui/form';
import {
  CAJA_TYPE,
  type CajaConSaldo,
  type CreateTransferenciaDto,
} from '@/shared/domain';
import { formatMoney } from '@/shared/format';
import { cajaLabel } from '@/shared/queries';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import type { TransferenciaFormValues } from '@/features/cajas/models/schemas';

/** Caja origen: solo hace falta su id y su saldo disponible. */
export interface TransferenciaOrigen {
  readonly id: string;
  readonly saldo: number;
}

const MONEY_DECIMALS = 2;

export function formatSaldo(saldo: number): string {
  return formatMoney(saldo, { decimals: MONEY_DECIMALS });
}

/** Destinos: todas las cajas menos el origen y las cuentas personales. */
export function destinoOptions(
  cajas: readonly CajaConSaldo[],
  origenId: string,
): FieldOption[] {
  return cajas
    .filter((caja) => caja.id !== origenId && caja.tipo !== CAJA_TYPE.PERSONAL)
    .map((caja) => ({ value: caja.id, label: cajaLabel(caja) }));
}

export interface TransferenciaPrecheck {
  readonly userId: string | null;
  readonly monto: number;
  readonly saldo: number;
}

/** Chequeos de cliente previos al POST (mismo orden que Angular). */
export function transferenciaPrecheck({
  userId,
  monto,
  saldo,
}: TransferenciaPrecheck): string | null {
  if (!userId) return C.NO_USER;
  if (monto > saldo) return C.saldoInsuficiente(formatSaldo(saldo));
  return null;
}

export interface TransferenciaDtoInput {
  readonly origenId: string;
  readonly responsableId: string;
  readonly values: TransferenciaFormValues;
}

export function buildTransferenciaDto({
  origenId,
  responsableId,
  values,
}: TransferenciaDtoInput): CreateTransferenciaDto | null {
  const { cajaDestinoId, monto } = values;
  if (!cajaDestinoId || monto === null) return null;
  const descripcion = values.descripcion.trim();
  return {
    cajaOrigenId: origenId,
    cajaDestinoId,
    monto,
    responsableId,
    fecha: values.fecha,
    ...(descripcion ? { descripcion } : {}),
  };
}
