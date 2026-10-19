/** Lógica pura de la tab "Fondo Solidario" (port de `FondoSolidarioComponent` + state). */
import { CONCEPTO_MOVIMIENTO, type Movimiento } from '@/shared/domain';
import type { FondoSolidarioData } from '@/features/cajas/services/cajas-api';
import type { TransferenciaOrigen } from '@/features/cajas/helpers/transferencia';

export interface TransferenciaRow {
  readonly id: string;
  readonly fecha: string;
  readonly descripcion: string | null;
  readonly responsable: string | null;
  readonly monto: number;
}

export interface FondoSolidarioView {
  /** Id de la caja del fondo (null = todavía no se creó). */
  readonly cajaId: string | null;
  readonly saldo: number;
  readonly bonificado: number;
  /** Origen fijo de la transferencia (null si no existe la caja de grupo). */
  readonly cajaGrupo: TransferenciaOrigen | null;
  readonly transferencias: readonly TransferenciaRow[];
}

/** Solo las transferencias entre cajas (el resto de movimientos del fondo no se lista). */
export function transferenciasRecibidas(
  movimientos: readonly Movimiento[],
): TransferenciaRow[] {
  return movimientos
    .filter((m) => m.concepto === CONCEPTO_MOVIMIENTO.TRANSFERENCIA_ENTRE_CAJAS)
    .map((m) => ({
      id: m.id,
      fecha: m.fecha,
      descripcion: m.descripcion,
      responsable: m.responsable?.nombre ?? null,
      monto: m.monto,
    }));
}

/** El saldo/id de la caja del fondo (si existe) manda sobre el consolidado. */
export function buildFondoSolidarioView(
  data: FondoSolidarioData,
): FondoSolidarioView {
  const { consolidado, fondo, movimientos } = data;
  const { cajaGrupo, fondoSolidario } = consolidado;
  return {
    cajaId: fondo.caja?.id ?? fondoSolidario.id,
    saldo: fondo.caja?.saldoActual ?? fondoSolidario.saldo,
    bonificado: fondoSolidario.bonificacionesOtorgadas,
    cajaGrupo: cajaGrupo.id
      ? { id: cajaGrupo.id, saldo: cajaGrupo.saldo }
      : null,
    transferencias: transferenciasRecibidas(movimientos),
  };
}
