/** Enums de persona — espejo de `backend/src/common/enums/index.ts`. */

export const PERSONA_TYPE = {
  PROTAGONISTA: 'protagonista',
  EDUCADOR: 'educador',
  /** Ojo: el valor es `externo` (no `externa`). */
  EXTERNA: 'externo',
  /** No es una persona: el grupo (o una rama) actuando como vendedor. Sin caja personal. */
  AGRUPACION: 'agrupacion',
} as const;

export type PersonaType = (typeof PERSONA_TYPE)[keyof typeof PERSONA_TYPE];

export const PERSONA_TYPE_LABELS: Readonly<Record<PersonaType, string>> = {
  protagonista: 'Protagonista',
  educador: 'Educador',
  externo: 'Persona Externa',
  agrupacion: 'Grupo',
};

export const ESTADO_PERSONA = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
} as const;

export type EstadoPersona = (typeof ESTADO_PERSONA)[keyof typeof ESTADO_PERSONA];

export const ESTADO_PERSONA_LABELS: Readonly<Record<EstadoPersona, string>> = {
  activo: 'Activo',
  inactivo: 'Deshabilitado',
};

export const RAMA = {
  MANADA: 'Manada',
  UNIDAD: 'Unidad',
  CAMINANTES: 'Caminantes',
  ROVERS: 'Rovers',
} as const;

export type Rama = (typeof RAMA)[keyof typeof RAMA];

/** Ramas en orden (de menor a mayor edad). */
export const RAMAS: readonly Rama[] = Object.values(RAMA);

export const RAMA_LABELS: Readonly<Record<Rama, string>> = {
  Manada: 'Manada',
  Unidad: 'Unidad',
  Caminantes: 'Caminantes',
  Rovers: 'Rovers',
};

export const CARGO_EDUCADOR = {
  EDUCADOR: 'Educador',
  JEFE_DE_RAMA: 'Jefe de Rama',
  JEFE_DE_GRUPO: 'Jefe de Grupo',
} as const;

export type CargoEducador = (typeof CARGO_EDUCADOR)[keyof typeof CARGO_EDUCADOR];

export const CARGOS_EDUCADOR: readonly CargoEducador[] = Object.values(CARGO_EDUCADOR);

export const CARGO_EDUCADOR_LABELS: Readonly<Record<CargoEducador, string>> = {
  Educador: 'Educador',
  'Jefe de Rama': 'Jefe de Rama',
  'Jefe de Grupo': 'Jefe de Grupo',
};
