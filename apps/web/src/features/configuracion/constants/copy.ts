/** Copy de Configuración (paridad con `ConfiguracionPageComponent`). */
export const CONFIG_COPY = {
  TITLE: 'Configuración',
  SUBTITLE: 'Configura los parámetros del sistema',
  INDEX_LABEL: 'Secciones de configuración',
  BACKUP_TITLE: 'Backup y Exportación',
  BACKUP_DESCRIPTION:
    'Descargá un respaldo de tus datos. Elegí el formato según lo que necesites.',
  XLSX_TITLE: 'Exportar a Excel',
  XLSX_SUBTITLE:
    'Archivo .xlsx con una hoja por tabla para abrir en Excel o Google Sheets',
  XLSX_SUCCESS: 'Exportación descargada',
  XLSX_ERROR: 'Error al exportar a Excel',
  SQL_TITLE: 'Backup de base de datos',
  SQL_SUBTITLE:
    'Archivo .sql.gz restaurable en PostgreSQL para recuperar los datos',
  SQL_SUCCESS: 'Backup descargado',
  SQL_ERROR: 'Error al generar el backup',
  DOWNLOADING: 'Descargando...',
  INSCRIPCIONES_TITLE: 'Configuración de Inscripciones',
  MONTO_SA: 'Monto Inscripción Scout Argentina',
  MONTO_GRUPO: 'Monto Inscripción de Grupo',
  SAVE: 'Guardar',
  SAVED: 'Configuración guardada exitosamente',
  INVALID: 'Por favor, ingrese valores válidos',
  MIN_ZERO: 'El monto no puede ser negativo',
} as const;

/** Índice lateral: anclas de cada sección (el perfil y la seguridad los aporta el feature auth). */
export const CONFIG_SECTIONS = [
  { id: 'perfil', label: 'Perfil' },
  { id: 'inscripciones', label: 'Inscripciones' },
  { id: 'backup', label: 'Backup' },
  { id: 'seguridad', label: 'Seguridad' },
] as const;

export type ConfigSectionId = (typeof CONFIG_SECTIONS)[number]['id'];

export const DOWNLOADS = {
  XLSX: { fallbackName: 'scout-export.xlsx' },
  SQL: { fallbackName: 'scout-backup.sql.gz' },
} as const;
