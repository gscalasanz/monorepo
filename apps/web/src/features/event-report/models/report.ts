/** Tipos derivados del contrato `reporteEventoSchema` (unión por `variante`). */
import type { ReporteEvento } from '@/shared/domain';

export type ReporteGrupo = Extract<ReporteEvento, { variante: 'grupo' }>;
export type ReporteVenta = Exclude<ReporteEvento, { variante: 'grupo' }>;
export type ReporteConGanancias = Extract<
  ReporteEvento,
  { variante: 'venta_cuentas_personales' | 'venta_mixta' }
>;
export type ReporteMixto = Extract<ReporteEvento, { variante: 'venta_mixta' }>;

export type ReporteEgreso = ReporteEvento['egresos'][number];
export type ReporteKpis = ReporteEvento['kpis'];
export type ReporteMeta = ReporteEvento['evento'];
export type ReporteIntegridadFlag = ReporteEvento['integridad'][number];
export type ReporteProducto = ReporteVenta['productos'][number];
export type ReportePorTipo = ReporteVenta['porTipoPersona'][number];
export type ReportePorRama = ReporteVenta['porRama'][number];
export type ReporteVendedor = ReporteVenta['vendedores'][number];
export type ReporteStock = ReporteVenta['stock'];
export type ReporteStockProducto = ReporteStock['productos'][number];
export type ReporteHorarios = ReporteVenta['horariosEntrega'];
export type ReporteGananciaPersona =
  ReporteConGanancias['gananciaPorPersona'][number];
export type ReporteIngreso = ReporteGrupo['ingresosItemizados'][number];

/** Resultado de cargar el reporte (el 404 anónimo no es un error: es "no disponible"). */
export type EventReportOutcome =
  | { readonly status: 'ok'; readonly reporte: ReporteEvento }
  | { readonly status: 'unavailable' };

/** KPI ya formateado (valor y bajada como texto). */
export interface ReportKpi {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly sub?: string;
}
