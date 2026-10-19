/** Lógica pura de "Cuentas Personales" (port de `CuentasPersonalesComponent`). */
import { isPersonaDisabled, type CajaConSaldo } from '@/shared/domain';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';

export interface CuentaRow {
  readonly id: string;
  readonly nombre: string;
  /** Rama del propietario o `null` (se muestra "-"). */
  readonly rama: string | null;
  readonly saldo: number;
  readonly propietarioId: string | null;
}

/** Un propietario deshabilitado solo figura mientras tenga saldo distinto de cero. */
export function isCuentaVisible(caja: CajaConSaldo): boolean {
  const deshabilitado =
    caja.propietario !== null && isPersonaDisabled(caja.propietario);
  return !deshabilitado || caja.saldoActual !== 0;
}

export function toCuentaRows(cajas: readonly CajaConSaldo[]): CuentaRow[] {
  return cajas.filter(isCuentaVisible).map((caja) => ({
    id: caja.id,
    nombre: caja.propietario?.nombre ?? caja.nombre ?? C.EMPTY_CELL,
    rama: caja.propietario?.rama ?? null,
    saldo: caja.saldoActual,
    propietarioId: caja.propietarioId,
  }));
}

/** Búsqueda cliente por nombre (`includes`, sin distinguir mayúsculas). */
export function searchCuentas(
  rows: readonly CuentaRow[],
  search: string,
): CuentaRow[] {
  const term = search.trim().toLowerCase();
  if (!term) return [...rows];
  return rows.filter((row) => row.nombre.toLowerCase().includes(term));
}
