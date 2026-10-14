/** Copy de Reportes (paridad con `ReporteDeudasComponent` y los placeholders). */
export const REPORTES_COPY = {
  TITLE: 'Reportes',
  SUBTITLE: 'Genera y visualiza reportes del grupo',
  KPIS_LABEL: 'Resumen de deudas',
  KPI_PERSONAS: 'Personas con deuda',
  KPI_TOTAL: 'Deuda total',
  KPI_DOCS: 'Con docs faltantes',
  LOADING: 'Cargando reporte...',
  ERROR:
    'Error al cargar el reporte. Verifique su conexión e intente nuevamente.',
  RETRY: 'Reintentar',
  EMPTY: 'No hay deudas pendientes con los filtros seleccionados',
  TABLE_LABEL: 'Personas con deuda',
  LIST_LABEL: 'Reporte de deudas',
  COL_PERSONA: 'Persona',
  COL_ACCIONES: 'Acciones',
  COL_DEUDAS: 'Deudas',
  COL_TOTAL: 'Total',
  VER_FICHA: (nombre: string): string => `Ver ficha de ${nombre}`,
  DOCS: (n: number): string => `${n} docs`,
  SIN_DEUDA_MONETARIA: 'Solo documentación',
  SECTION_MONETARIAS: 'Deudas monetarias',
  SECTION_AUTORIZACIONES: 'Autorizaciones faltantes',
  SECTION_DOCUMENTACION: 'Documentación',
  AUT_CAMPAMENTO: (nombre: string, ano: number): string =>
    `Aut. ${nombre} ${ano}`,
  EXPAND: (nombre: string): string => `Ver detalle de ${nombre}`,
  DOC_OK: 'Entregado',
  DOC_FALTA: 'Falta',
  FILTER_RAMA: 'Rama',
  FILTER_ANO: 'Año',
  FILTER_TIPO: 'Tipo de deuda',
} as const;

/** Etiquetas de deudas y documentos (exactas a Angular). */
export const DEBT_LABELS = {
  CAMPAMENTO: 'Camp.',
  SCOUT: 'Scout AR',
  GRUPO: 'Grupo',
  INSCRIPCION: 'Inscripción',
} as const;

export const DOC_LABELS = {
  DNI: 'DNI',
  PARTIDA: 'Partida nac.',
  DNI_PADRES: 'DNI padres',
  OBRA_SOCIAL: 'Obra social',
  SALUD: 'Decl. salud',
  IMAGEN: 'Aut. imagen',
  SALIDAS: 'Salidas',
  INGRESO: 'Aut. ingreso',
  APTITUD: 'Apt. física',
} as const;

export const TIPO_DEUDA_LABELS = {
  dinero: 'Dinero (todas)',
  campamentos: 'Campamentos',
  inscripcionesScout: 'Inscripciones Scout AR',
  inscripcionesGrupo: 'Inscripciones Grupo',
  documentacion: 'Documentación',
} as const;

/** Placeholders de Angular (sin API): se mantienen igual. */
export const PLACEHOLDER_REPORTS = {
  reembolsos: {
    title: 'Reporte de Reembolsos Pendientes',
    body: 'Reporte de reembolsos pendientes',
  },
  caja: { title: 'Reporte de Caja', body: 'Reporte de movimientos de caja' },
  eventos: {
    title: 'Reporte de Eventos',
    body: 'Reporte de resultados de eventos',
  },
  comprobantes: {
    title: 'Reporte de Comprobantes Pendientes',
    body: 'Reporte de comprobantes pendientes',
  },
} as const;

export type PlaceholderReport = keyof typeof PLACEHOLDER_REPORTS;

export function isPlaceholderReport(value: string): value is PlaceholderReport {
  return Object.hasOwn(PLACEHOLDER_REPORTS, value);
}
