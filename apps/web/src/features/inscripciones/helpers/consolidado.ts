/** View-model del consolidado (barra de stats de la lista y dashboard). */
import { LOCALE } from '@/shared/constants';
import type {
  DistribucionPorRama,
  InscripcionesConsolidado,
} from '@/shared/domain';
import { DASHBOARD_COPY as C } from '@/features/inscripciones/constants/copy';
import {
  PERCENT,
  RAMA_CONFIGS,
} from '@/features/inscripciones/constants/inscripciones';

export interface RamaShare {
  readonly key: string;
  readonly label: string;
  readonly color: string;
  readonly count: number;
  /** 0–100 sobre el total (total 0 → divide por 1, como Angular). */
  readonly percentage: number;
}

export function ramaShares(params: {
  readonly porRama: DistribucionPorRama;
  readonly total: number;
}): readonly RamaShare[] {
  const total = params.total || 1;
  return RAMA_CONFIGS.map((rama) => {
    const count = params.porRama[rama.key];
    return {
      key: rama.key,
      label: rama.label,
      color: rama.color,
      count,
      percentage: (count / total) * PERCENT,
    };
  });
}

/** Desglose "Rama: n" de una categoría de deudores (solo ramas con >0). */
export function ramaBreakdown(
  porRama: DistribucionPorRama,
): readonly { readonly label: string; readonly count: number }[] {
  return RAMA_CONFIGS.map((rama) => ({
    label: rama.label,
    count: porRama[rama.key],
  })).filter((item) => item.count > 0);
}

export type FinancialKey = keyof InscripcionesConsolidado['financiero'];

export interface FinancialMetric {
  readonly key: FinancialKey;
  readonly label: string;
  readonly value: number;
  /** % sobre el esperado (tope 100); `null` para el propio esperado. */
  readonly percentage: number | null;
}

const FINANCIAL_LABELS: readonly {
  readonly key: FinancialKey;
  readonly label: string;
}[] = [
  { key: 'montoEsperado', label: C.ESPERADO },
  { key: 'montoPagado', label: C.PAGADO },
  { key: 'montoAdeudado', label: C.ADEUDADO },
  { key: 'montoBonificado', label: C.BONIFICADO },
];

export function financialMetrics(
  financiero: InscripcionesConsolidado['financiero'],
): readonly FinancialMetric[] {
  const esperado = financiero.montoEsperado || 1;
  return FINANCIAL_LABELS.map(({ key, label }) => ({
    key,
    label,
    value: financiero[key],
    percentage:
      key === 'montoEsperado'
        ? null
        : Math.min((financiero[key] / esperado) * PERCENT, PERCENT),
  }));
}

/** % cobrado (pagado / esperado); 0 si no hay esperado. */
export function cobradoPercent(
  financiero: InscripcionesConsolidado['financiero'],
): number {
  if (!financiero.montoEsperado) return 0;
  return (financiero.montoPagado / financiero.montoEsperado) * PERCENT;
}

export type DebtorKey = 'dinero' | 'documentacion' | 'ambos';

export interface DebtorCategory {
  readonly key: DebtorKey;
  readonly label: string;
  readonly description: string;
  readonly count: number;
  readonly monto?: number;
  readonly breakdown: readonly {
    readonly label: string;
    readonly count: number;
  }[];
}

export function debtorCategories(
  deudores: InscripcionesConsolidado['deudores'],
): readonly DebtorCategory[] {
  return [
    {
      key: 'dinero',
      label: C.DEUDA_DINERO,
      description: C.DEUDA_DINERO_DESC,
      count: deudores.dinero.total,
      monto: deudores.dinero.monto,
      breakdown: ramaBreakdown(deudores.dinero.porRama),
    },
    {
      key: 'documentacion',
      label: C.DOCUMENTACION,
      description: C.DOCUMENTACION_DESC,
      count: deudores.documentacion.total,
      breakdown: ramaBreakdown(deudores.documentacion.porRama),
    },
    {
      key: 'ambos',
      label: C.AMBOS,
      description: C.AMBOS_DESC,
      count: deudores.ambos.total,
      breakdown: ramaBreakdown(deudores.ambos),
    },
  ];
}

/** `12.3` (1 decimal, coma es-AR). */
export function formatPercent(value: number, decimals = 1): string {
  return value.toLocaleString(LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
