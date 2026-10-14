/** Copy del módulo personas (paridad exacta con `modules/personas` de Angular). */
export const PERSONAS_COPY = {
  TITLE: 'Gestión de Personas',
  SUBTITLE: 'Administra protagonistas, educadores y personas externas',
  NEW_MEMBER: 'Nuevo Miembro',
  STATS_LABEL: 'Resumen de personas',
  STAT_PROTAGONISTAS: 'Protagonistas',
  STAT_EDUCADORES: 'Educadores',
  STAT_EXTERNAS: 'Personas Extras',
  STAT_ACTIVOS: 'Total Activos',
  TABS_LABEL: 'Tipo de persona',
  TAB_EDUCADORES: 'Educadores',
  TAB_EXTERNOS: 'Externos',
  SEARCH_LABEL: 'Buscar',
  SEARCH_PLACEHOLDER: 'Buscar por nombre...',
  SHOW_DISABLED: 'Mostrar deshabilitados',
  COL_NOMBRE: 'Nombre y Apellido',
  COL_ESTADO: 'Estado',
  COL_PARTIDA: 'Partida',
  COL_DNI: 'DNI',
  COL_DNI_PADRES: 'DNI Padres',
  COL_OBRA_SOCIAL: 'Obra Social',
  COL_ACCIONES: 'Acciones',
  DOC_DELIVERED: 'Entregado',
  DOC_PENDING: 'Pendiente',
  DOC_SUMMARY: (entregados: number, total: number): string =>
    `Documentación ${entregados} de ${total}`,
  TABLE_LABEL: 'Listado de personas',
  ROW_ACTIONS: (nombre: string): string => `Acciones para ${nombre}`,
  LOADING: 'Cargando personas...',
  LOAD_ERROR: 'Error al cargar personas',
  EMPTY: 'No se encontraron personas',
  EMPTY_HINT:
    'Probá con otra pestaña, otro nombre o mostrando los deshabilitados.',
  ACTION_VIEW: 'Ver',
  ACTION_EDIT: 'Editar',
  ACTION_DISABLE: 'Deshabilitar',
  ACTION_DISABLE_HINT:
    'Deshabilitar (deja de aparecer al crear inscripciones, campamentos, etc.)',
  ACTION_ENABLE: 'Rehabilitar',
  ACTION_DELETE: 'Eliminar',
  DISABLE_TITLE: 'Deshabilitar persona',
  DISABLE_MESSAGE: (nombre: string): string =>
    `${nombre} dejará de aparecer al crear inscripciones, campamentos, ventas o movimientos. ` +
    'Su historial y sus deudas pendientes siguen visibles.',
  ENABLE_TITLE: 'Rehabilitar persona',
  ENABLE_MESSAGE: (nombre: string): string =>
    `${nombre} vuelve a aparecer en todas las listas.`,
  DISABLED_OK: 'Persona deshabilitada',
  ENABLED_OK: 'Persona rehabilitada',
  DELETED_OK: 'Persona eliminada exitosamente',
  ENTITY_PROTAGONISTA: 'protagonista',
  ENTITY_EDUCADOR: 'educador',
  ENTITY_EXTERNA: 'persona externa',
  ENTITY_AGRUPACION: 'agrupacion',
} as const;

/** Ficha de protagonista/educador (`PersonaDashboardComponent`). */
export const FICHA_COPY = {
  LOADING: 'Cargando datos...',
  LOAD_ERROR: 'Error al cargar dashboard',
  BACK: 'Volver',
  NOT_FOUND: 'Persona no encontrada',
  BACK_TO_LIST: 'Volver al listado',
  EDIT: 'Editar',
  TRANSFER: 'Transferir a caja grupo',
  TRANSFER_TITLE: (saldo: string): string => `Transferir ${saldo} a caja grupo`,
  TRANSFER_MESSAGE: (params: {
    readonly saldo: string;
    readonly nombre: string;
  }): string =>
    `Se transferirá el saldo de ${params.saldo} de la cuenta personal de ${params.nombre} ` +
    'a la caja del grupo. ¿Confirmás?',
  TRANSFER_CONFIRM: 'Transferir',
  TRANSFER_CANCEL: 'Cancelar',
  TRANSFER_OK: (saldo: string): string =>
    `Se transfirieron ${saldo} a la caja del grupo`,
  TRANSFER_ERROR: 'Error al transferir saldo',
  FALLBACK_NAME: 'esta persona',
  ESTADO_LABEL: (estado: string): string => `Estado: ${estado}`,
  SALDO: 'Saldo cuenta personal',
  SALDO_HINT: 'Disponible para pagar inscripciones o campamentos.',
  DEUDA_TOTAL: 'Deuda total',
  DEUDA_INSCRIPCIONES: 'Inscripciones',
  DEUDA_CAMPAMENTOS: 'Campamentos',
  DEUDA_BREAKDOWN_LABEL: 'Deuda por origen',
  OBLIGACIONES: 'Obligaciones',
  NO_OBLIGACIONES: 'Sin inscripciones ni campamentos registrados',
  YEAR_LABEL: 'Año',
  SALDO_PENDIENTE: 'Saldo pendiente:',
  PENDIENTE: 'pendiente',
  AL_DIA: 'al día',
  PAGADO_DE: (pagado: string, total: string): string => `${pagado} de ${total}`,
  FALTA_AUTORIZACION: 'Falta autorización',
  DOCUMENTACION: 'Documentación',
  DOC_COUNT: (entregados: number, total: number): string =>
    `${entregados} de ${total}`,
  DOC_PARTIDA: 'Partida de Nacimiento',
  DOC_DNI: 'DNI',
  DOC_DNI_PADRES: 'DNI Padres',
  DOC_OBRA_SOCIAL: 'Carnet Obra Social',
  DOC_UPDATE: 'Actualizar',
  DOC_DELIVERED: 'Entregado',
  DOC_PENDING: 'Falta',
  MOVIMIENTOS: 'Actividad',
  NO_MOVIMIENTOS: 'Sin movimientos recientes',
  NO_MOVIMIENTOS_HINT: 'Cuando la persona pague o use su saldo, aparece acá.',
  DETAIL_SEPARATOR: ' · ',
} as const;

/** Detalle de persona externa (`PersonasExternasDetailComponent`). */
export const EXTERNA_DETAIL_COPY = {
  TITLE: 'Detalle de Persona Externa',
  LOADING: 'Cargando...',
  NOT_FOUND: 'Persona externa no encontrada',
  BACK: 'Volver',
  BACK_TO_LIST: 'Volver al listado',
  CONTACTO: 'Contacto',
  NOTAS: 'Notas',
  EMPTY_VALUE: '-',
  EDIT: 'Editar',
  DELETE: 'Eliminar',
  DELETED_OK: 'Persona externa eliminada exitosamente',
} as const;
