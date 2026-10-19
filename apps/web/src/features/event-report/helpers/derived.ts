/** Cálculos puros de las secciones (port de los `computed` de cada sección Angular). */
import type {
  BarDatum,
  DonutSlice,
  DistributionSegment,
} from '@/shared/components/charts';
import { seriesColor } from '@/shared/components/charts';
import {
  ESTADO_PAGO,
  REPORTE_VARIANTE,
  type ReporteEvento,
} from '@/shared/domain';
import {
  PERSONA_COLORS,
  RAMA_COLORS,
  isEducador,
  personaColor,
} from '@/features/event-report/constants/colors';
import { EVENT_REPORT_COPY } from '@/features/event-report/constants/copy';
import { formatPct } from '@/features/event-report/helpers/format';
import type {
  ReporteConGanancias,
  ReporteEgreso,
  ReporteHorarios,
  ReportePorRama,
  ReportePorTipo,
  ReporteProducto,
  ReporteStock,
  ReporteVendedor,
  ReporteVenta,
} from '@/features/event-report/models/report';

const FULL_WIDTH = 100;
export const HORARIOS_SERIES_KEY = 'porciones';

export function isReporteVenta(vm: ReporteEvento): vm is ReporteVenta {
  return vm.variante !== REPORTE_VARIANTE.GRUPO;
}

export function hasGananciaPorPersona(
  vm: ReporteEvento,
): vm is ReporteConGanancias {
  return (
    vm.variante === REPORTE_VARIANTE.VENTA_CUENTAS_PERSONALES ||
    vm.variante === REPORTE_VARIANTE.VENTA_MIXTA
  );
}

/** Egresos que el grupo todavía le debe a quien adelantó la plata. */
export function pendientesDePago(
  egresos: readonly ReporteEgreso[],
): readonly ReporteEgreso[] {
  return egresos.filter(
    (e) => e.estadoPago === ESTADO_PAGO.PENDIENTE_REEMBOLSO,
  );
}

export function sumMontos(
  items: readonly { readonly monto: number }[],
): number {
  return items.reduce((total, item) => total + item.monto, 0);
}

export interface RankingRow extends ReporteVendedor {
  /** Ancho de la barra relativo al primero (0–100). */
  readonly width: number;
  readonly color: string;
  readonly tag: string;
}

/** Ranking por recaudado descendente; la barra es relativa al primero. */
export function rankingRows(
  vendedores: readonly ReporteVendedor[],
): readonly RankingRow[] {
  const sorted = [...vendedores].sort((a, b) => b.recaudado - a.recaudado);
  const max = sorted[0]?.recaudado ?? 0;
  return sorted.map((v) => ({
    ...v,
    width: max > 0 ? (v.recaudado / max) * FULL_WIDTH : 0,
    color: personaColor(v.tipo),
    tag: isEducador(v.tipo)
      ? EVENT_REPORT_COPY.ranking.tagEducador
      : EVENT_REPORT_COPY.ranking.tagProtagonista,
  }));
}

/** `"12,5%"` de unidades pendientes sobre vendidas (`0%` si no hubo ventas). */
export function stockPendientePct(stock: ReporteStock): string {
  return stock.totalVendido > 0
    ? formatPct(stock.totalPendiente / stock.totalVendido)
    : formatPct(0);
}

export function horarioBars(horarios: ReporteHorarios): readonly BarDatum[] {
  return horarios.franjas.map((f) => ({
    label: f.desde,
    values: { [HORARIOS_SERIES_KEY]: f.porciones },
  }));
}

/** Franja con más porciones (la primera si empatan), o `null` sin franjas. */
export function franjaPico(horarios: ReporteHorarios): string | null {
  const [first, ...rest] = horarios.franjas;
  if (!first) return null;
  return rest.reduce(
    (pico, f) => (f.porciones > pico.porciones ? f : pico),
    first,
  ).desde;
}

export interface FueraDeDiaSummary {
  readonly total: number;
  readonly dias: string;
}

export function fueraDeDiaSummary(
  horarios: ReporteHorarios,
): FueraDeDiaSummary | null {
  if (horarios.fueraDeDia.length === 0) return null;
  return {
    total: horarios.fueraDeDia.reduce((total, d) => total + d.entregas, 0),
    dias: horarios.fueraDeDia.map((d) => d.dia).join(', '),
  };
}

export function productoSlices(
  productos: readonly ReporteProducto[],
): readonly DonutSlice[] {
  return productos.map((p) => ({ label: p.nombre, value: p.recaudado }));
}

/** Rama con su token; "Educadores" con el color de educador; el resto, serie fija. */
export function ramaSlices(
  porRama: readonly ReportePorRama[],
): readonly DonutSlice[] {
  return porRama.map((r, index) => ({
    label: r.grupo,
    value: r.recaudado,
    color: r.esEducador
      ? PERSONA_COLORS.educador
      : (RAMA_COLORS[r.grupo] ?? seriesColor(index)),
  }));
}

export function porTipoSegments(
  porTipo: readonly ReportePorTipo[],
): readonly DistributionSegment[] {
  return porTipo.map((t) => ({
    label: t.label,
    value: t.recaudado,
    color: personaColor(t.tipo),
  }));
}
