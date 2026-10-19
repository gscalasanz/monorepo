/**
 * Enums de persona. La definición vive en `@scout/shared/enums` (única para web y api);
 * acá se re-exporta con el nombre histórico del front (adaptador). Los `*_LABELS` son copy
 * de UI y se quedan en web.
 */
import {
  CargoEducador as CARGO_EDUCADOR,
  EstadoPersona as ESTADO_PERSONA,
  PersonaType as PERSONA_TYPE,
  Rama as RAMA,
  type CargoEducador,
  type EstadoPersona,
  type PersonaType,
  type Rama,
} from '@scout/shared/enums';

export { CARGO_EDUCADOR, ESTADO_PERSONA, PERSONA_TYPE, RAMA };
export type { CargoEducador, EstadoPersona, PersonaType, Rama };

export const PERSONA_TYPE_LABELS: Readonly<Record<PersonaType, string>> = {
  protagonista: 'Protagonista',
  educador: 'Educador',
  externo: 'Persona Externa',
  agrupacion: 'Grupo',
};

export const ESTADO_PERSONA_LABELS: Readonly<Record<EstadoPersona, string>> = {
  activo: 'Activo',
  inactivo: 'Deshabilitado',
};

/** Ramas en orden (de menor a mayor edad). */
export const RAMAS: readonly Rama[] = Object.values(RAMA);

export const RAMA_LABELS: Readonly<Record<Rama, string>> = {
  Manada: 'Manada',
  Unidad: 'Unidad',
  Caminantes: 'Caminantes',
  Rovers: 'Rovers',
};

export const CARGOS_EDUCADOR: readonly CargoEducador[] =
  Object.values(CARGO_EDUCADOR);

export const CARGO_EDUCADOR_LABELS: Readonly<Record<CargoEducador, string>> = {
  Educador: 'Educador',
  'Jefe de Rama': 'Jefe de Rama',
  'Jefe de Grupo': 'Jefe de Grupo',
};
