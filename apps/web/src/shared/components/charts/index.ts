/** `@/shared/components/charts` — gráficos (recharts) y métricas con tokens de datos. */
export { BarChartCard, type BarChartCardProps, type BarDatum, type BarSeries } from './bar-chart-card';
export { ChartLegend, type ChartLegendProps, type LegendItem } from './chart-legend';
export {
  AXIS_TICK,
  BAR_RADIUS,
  CHART_COLORS,
  CHART_DEFAULT_HEIGHT,
  SERIES_COLORS,
  seriesColor,
} from './chart-theme';
export { ChartTooltip, type ChartTooltipProps } from './chart-tooltip';
export { CHARTS_COPY } from './copy';
export { DistributionBar, type DistributionBarProps, type DistributionSegment } from './distribution-bar';
export { DonutChart, type DonutChartProps, type DonutSlice } from './donut-chart';
export { KpiDelta, type KpiDeltaValue } from './kpi-delta';
export { KpiStrip, type KpiItem, type KpiStripProps } from './kpi-strip';
export { ProgressTrack, type ProgressTrackProps } from './progress-track';
export { Sparkline, type SparklineProps } from './sparkline';
export { StatCard, type StatCardFormat, type StatCardProps, type StatCardVariant } from './stat-card';
