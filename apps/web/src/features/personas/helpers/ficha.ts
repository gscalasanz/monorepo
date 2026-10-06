/**
 * View-model de la ficha de persona (`GET /personas/:id/dashboard`): tono del
 * saldo, checklist de documentación, progreso de obligaciones y movimientos
 * agrupados por mes.
 */
import {
  CONCEPTO_MOVIMIENTO_LABELS,
  MEDIO_PAGO_LABELS,
  RAMA,
  TIPO_MOVIMIENTO,
  conceptoMovimientoSchema,
  type Rama,
} from '@/shared/domain';
import {
  DATE_FORMATS,
  formatDate,
  formatInBsAs,
  resolveBackendDate,
} from '@/shared/time';
import { FICHA_COPY as C } from '@/features/personas/constants/copy';
import type {
  DocumentacionPersonal,
  MovimientoDashboard,
} from '@/features/personas/models/dashboard-schema';

export type SaldoTone = 'positive' | 'negative' | 'zero';

/** Paridad con `saldoVariant`: >0 success, <0 danger, 0 warning. */
export function saldoTone(saldo: number): SaldoTone {
  if (saldo > 0) return 'positive';
  if (saldo < 0) return 'negative';
  return 'zero';
}

export interface DocItem {
  readonly key: keyof Omit<DocumentacionPersonal, 'completa'>;
  readonly label: string;
  readonly delivered: boolean;
}

const DOC_LABELS: readonly Pick<DocItem, 'key' | 'label'>[] = [
  { key: 'partidaNacimiento', label: C.DOC_PARTIDA },
  { key: 'dni', label: C.DOC_DNI },
  { key: 'dniPadres', label: C.DOC_DNI_PADRES },
  { key: 'carnetObraSocial', label: C.DOC_OBRA_SOCIAL },
];

/** Checklist de documentación; Rovers (mayores de edad) sin "DNI Padres". */
export function docItems(params: {
  readonly documentacion: DocumentacionPersonal;
  readonly rama: Rama | null;
}): DocItem[] {
  const { documentacion, rama } = params;
  return DOC_LABELS.filter(
    (item) => !(rama === RAMA.ROVERS && item.key === 'dniPadres'),
  ).map((item) => ({
    ...item,
    delivered: documentacion[item.key],
  }));
}

/** Fracción pagada (0–1) de una obligación; total 0 cuenta como saldada. */
export function paidRatio(params: {
  readonly pagado: number;
  readonly total: number;
}): number {
  if (params.total <= 0) return 1;
  return Math.min(Math.max(params.pagado / params.total, 0), 1);
}

/** Label del concepto (o el texto libre que manda el backend como `descripcion`). */
export function conceptoLabel(concepto: string): string {
  const parsed = conceptoMovimientoSchema.safeParse(concepto);
  return parsed.success ? CONCEPTO_MOVIMIENTO_LABELS[parsed.data] : concepto;
}

export interface MovimientoRow {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly direction: 'in' | 'out';
  /** Con signo: ingreso +, egreso −. */
  readonly amount: number;
}

export interface MovimientoGroup {
  readonly key: string;
  readonly label: string;
  readonly rows: readonly MovimientoRow[];
}

const MONTH_KEY_PATTERN = 'yyyy-MM';
const MONTH_LABEL_PATTERN = 'MMMM yyyy';

function toRow(mov: MovimientoDashboard): MovimientoRow {
  const isIngreso = mov.tipo === TIPO_MOVIMIENTO.INGRESO;
  return {
    id: mov.id,
    title: conceptoLabel(mov.concepto),
    detail: `${formatDate(mov.fecha, DATE_FORMATS.dayMonthYear)}${C.DETAIL_SEPARATOR}${MEDIO_PAGO_LABELS[mov.medioPago]}`,
    direction: isIngreso ? 'in' : 'out',
    amount: isIngreso ? mov.monto : -mov.monto,
  };
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Agrupa por mes (en BsAs) respetando el orden del backend (fecha desc). */
export function groupMovimientosByMonth(
  movimientos: readonly MovimientoDashboard[],
): MovimientoGroup[] {
  return movimientos.reduce<MovimientoGroup[]>((groups, mov) => {
    const instant = resolveBackendDate(mov.fecha);
    const key = instant ? formatInBsAs(instant, MONTH_KEY_PATTERN) : '';
    const label = instant
      ? capitalize(formatInBsAs(instant, MONTH_LABEL_PATTERN))
      : '';
    const last = groups.at(-1);
    if (last && last.key === key) {
      return [
        ...groups.slice(0, -1),
        { ...last, rows: [...last.rows, toRow(mov)] },
      ];
    }
    return [...groups, { key, label, rows: [toRow(mov)] }];
  }, []);
}
