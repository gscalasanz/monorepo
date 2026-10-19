/**
 * Vocabulario de dominio de personas. Única definición: la importan `api` y `web`.
 * Representación: objeto `as const` + tipo homónimo (ver docs/adr/0001-representacion-enums.md).
 */

/**
 * Tipo de persona (discriminador de Single Table Inheritance en `personas.tipo`).
 * PRD §2.1: Protagonista, Educador, Persona Externa.
 *
 * AGRUPACION no es una persona: es el grupo (o un colectivo futuro, p. ej. una rama)
 * actuando como vendedor, para que una venta "del grupo" tenga un vendedor real. Nunca
 * tiene caja personal, no aparece en listados de miembros ni en el reporte de deudores.
 *
 * Ojo: el valor de EXTERNA es `externo` (no `externa`).
 */
export const PersonaType = {
  PROTAGONISTA: 'protagonista',
  EDUCADOR: 'educador',
  EXTERNA: 'externo',
  AGRUPACION: 'agrupacion',
} as const;
export type PersonaType = (typeof PersonaType)[keyof typeof PersonaType];

/** Estado de una persona (PRD §3.1, F1/F2). `inactivo` = deshabilitada. */
export const EstadoPersona = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
} as const;
export type EstadoPersona = (typeof EstadoPersona)[keyof typeof EstadoPersona];

/** Ramas scout, de menor a mayor edad (PRD §2.2). */
export const Rama = {
  MANADA: 'Manada',
  UNIDAD: 'Unidad',
  CAMINANTES: 'Caminantes',
  ROVERS: 'Rovers',
} as const;
export type Rama = (typeof Rama)[keyof typeof Rama];

/** Cargo que desempeña un educador en el grupo. */
export const CargoEducador = {
  EDUCADOR: 'Educador',
  JEFE_DE_RAMA: 'Jefe de Rama',
  JEFE_DE_GRUPO: 'Jefe de Grupo',
} as const;
export type CargoEducador = (typeof CargoEducador)[keyof typeof CargoEducador];
