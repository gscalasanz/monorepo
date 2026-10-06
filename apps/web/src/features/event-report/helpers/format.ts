/** Formatos del reporte (port de `reporte-format.ts` + pipe `percent:'1.0-1'`). */
import { LOCALE } from '@/shared/constants';
import { MEDIO_PAGO_LABELS, type MedioPago } from '@/shared/domain';

const PERCENT_FACTOR = 100;
const PERCENT_MAX_DECIMALS = 1;

const percentFormatter = new Intl.NumberFormat(LOCALE, {
  maximumFractionDigits: PERCENT_MAX_DECIMALS,
});

/** Ratio 0–1 → `"40%"` / `"12,5%"` (máx. 1 decimal, es-AR). */
export function formatPct(ratio: number): string {
  return `${percentFormatter.format(ratio * PERCENT_FACTOR)}%`;
}

function isMedioPago(value: string): value is MedioPago {
  return Object.hasOwn(MEDIO_PAGO_LABELS, value);
}

/** Label del medio de pago; si el backend manda uno desconocido, el valor tal cual. */
export function medioPagoLabel(value: string): string {
  return isMedioPago(value) ? MEDIO_PAGO_LABELS[value] : value;
}
