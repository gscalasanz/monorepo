/** Lógica pura del `TransferenciaDialog` (origen fijo elegido por el caller). */
import type { FieldOption } from '@/shared/components/ui/form';
import {
  CAJA_TYPE,
  isPersonaDisabled,
  type CajaConSaldo,
  type CreateTransferenciaDto,
} from '@/shared/domain';
import { formatMoney } from '@/shared/format';
import { cajaLabel } from '@/shared/queries';
import { TRANSFERENCIA_COPY as C } from '@/shared/components/transferencia/copy';
import type { TransferenciaFormValues } from '@/shared/components/transferencia/schema';

/** Caja origen: id, saldo disponible y nombre a mostrar. */
export interface TransferenciaOrigen {
  readonly id: string;
  readonly saldo: number;
  readonly nombre: string;
}

const MONEY_DECIMALS = 2;

export function formatSaldo(saldo: number): string {
  return formatMoney(saldo, { decimals: MONEY_DECIMALS });
}

export interface DestinoOptionsInput {
  readonly cajas: readonly CajaConSaldo[];
  readonly origenId: string;
  /** Si es `false` (default), las cuentas personales no se ofrecen como destino. */
  readonly incluirPersonales?: boolean;
}

/** Cuenta personal ofrecible: solo si se piden personales y su dueño está habilitado. */
function isPersonalOfrecible(
  caja: CajaConSaldo,
  incluirPersonales: boolean,
): boolean {
  if (!incluirPersonales) return false;
  return !caja.propietario || !isPersonaDisabled(caja.propietario);
}

/** Destinos: todas las cajas menos el origen (y las personales, salvo que se pidan). */
export function destinoOptions({
  cajas,
  origenId,
  incluirPersonales = false,
}: DestinoOptionsInput): FieldOption[] {
  return cajas
    .filter(
      (caja) =>
        caja.id !== origenId &&
        (caja.tipo !== CAJA_TYPE.PERSONAL ||
          isPersonalOfrecible(caja, incluirPersonales)),
    )
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
