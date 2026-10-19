/** Copy de gráficos y métricas (español rioplatense). */
export const CHARTS_COPY = {
  noData: 'Sin datos para graficar',
  total: 'Total',
  sparklineLabel: (first: string, last: string) => `Tendencia: de ${first} a ${last}`,
  deltaDirection: { up: 'Sube', down: 'Baja', flat: 'Sin cambios' },
  distributionLabel: (parts: string) => `Distribución: ${parts}`,
} as const;
