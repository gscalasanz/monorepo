/**
 * Lógica pura del listado de personas (port de `PersonasDashboardComponent`):
 * separación por tipo, filtros por tab/búsqueda/deshabilitados, stats y
 * columnas de documentación por tab.
 */
import {
  ESTADO_PERSONA,
  PERSONA_TYPE,
  RAMA,
  RAMA_TAB_KEYS,
  onlyEnabled,
  ramaFromTabKey,
  type Educador,
  type Persona,
  type PersonaExterna,
  type Protagonista,
} from '@/shared/domain';
import {
  PERSONA_TAB,
  type PersonasTab,
} from '@/features/personas/constants/personas';

/** Personas que se listan (las agrupaciones no aparecen en este módulo). */
export type ListedPersona = Protagonista | Educador | PersonaExterna;

export interface PersonasByTipo {
  readonly protagonistas: readonly Protagonista[];
  readonly educadores: readonly Educador[];
  readonly externas: readonly PersonaExterna[];
}

export function splitByTipo(personas: readonly Persona[]): PersonasByTipo {
  return {
    protagonistas: personas.filter(
      (p): p is Protagonista => p.tipo === PERSONA_TYPE.PROTAGONISTA,
    ),
    educadores: personas.filter(
      (p): p is Educador => p.tipo === PERSONA_TYPE.EDUCADOR,
    ),
    externas: personas.filter(
      (p): p is PersonaExterna => p.tipo === PERSONA_TYPE.EXTERNA,
    ),
  };
}

/** Tabla y stats comparten el criterio para que siempre coincidan. */
export function visibles<T extends ListedPersona>(params: {
  readonly personas: readonly T[];
  readonly showDisabled: boolean;
}): readonly T[] {
  return params.showDisabled ? params.personas : onlyEnabled(params.personas);
}

function personasOfTab(params: {
  readonly groups: PersonasByTipo;
  readonly tab: PersonasTab;
}): readonly ListedPersona[] {
  const { groups, tab } = params;
  const rama = ramaFromTabKey(tab);
  if (rama) return groups.protagonistas.filter((p) => p.rama === rama);
  if (tab === PERSONA_TAB.EDUCADORES) return groups.educadores;
  return groups.externas;
}

export interface PersonasFilter {
  readonly tab: PersonasTab;
  readonly search: string;
  readonly showDisabled: boolean;
}

/** Filas de la tab activa: visibles + búsqueda `includes` case-insensitive. */
export function filterPersonas(params: {
  readonly groups: PersonasByTipo;
  readonly filter: PersonasFilter;
}): readonly ListedPersona[] {
  const { groups, filter } = params;
  const search = filter.search.trim().toLowerCase();
  const rows = visibles({
    personas: personasOfTab({ groups, tab: filter.tab }),
    showDisabled: filter.showDisabled,
  });
  return search
    ? rows.filter((p) => p.nombre.toLowerCase().includes(search))
    : rows;
}

export interface PersonasStats {
  readonly protagonistas: number;
  readonly educadores: number;
  readonly externas: number;
  /** Rareza mantenida: siempre cuenta `activo` sobre todas, ignore el toggle. */
  readonly activos: number;
}

export function buildStats(params: {
  readonly groups: PersonasByTipo;
  readonly showDisabled: boolean;
}): PersonasStats {
  const { groups, showDisabled } = params;
  const all: readonly ListedPersona[] = [
    ...groups.protagonistas,
    ...groups.educadores,
    ...groups.externas,
  ];
  return {
    protagonistas: visibles({ personas: groups.protagonistas, showDisabled })
      .length,
    educadores: visibles({ personas: groups.educadores, showDisabled }).length,
    externas: visibles({ personas: groups.externas, showDisabled }).length,
    activos: all.filter((p) => p.estado === ESTADO_PERSONA.ACTIVO).length,
  };
}

export const DOC_KEYS = [
  'partidaNacimiento',
  'dni',
  'dniPadres',
  'carnetObraSocial',
] as const;

export type DocKey = (typeof DOC_KEYS)[number];

/**
 * Columnas de documentación por tab: Educadores sin docs; Rovers sin "DNI
 * Padres" (mayores de edad); resto (incluido Externos, rareza mantenida) todas.
 */
export function docKeysForTab(tab: PersonasTab): readonly DocKey[] {
  if (tab === PERSONA_TAB.EDUCADORES) return [];
  if (tab === RAMA_TAB_KEYS[RAMA.ROVERS])
    return DOC_KEYS.filter((key) => key !== 'dniPadres');
  return DOC_KEYS;
}

/** Documentación booleana de la fila (no protagonistas → `false`, como Angular). */
export function docValue(params: {
  readonly persona: ListedPersona;
  readonly key: DocKey;
}): boolean {
  const { persona, key } = params;
  return persona.tipo === PERSONA_TYPE.PROTAGONISTA ? persona[key] : false;
}

/** Copia inmutable con el estado nuevo de la persona `id`. */
export function withEstado<T extends Persona>(params: {
  readonly personas: readonly T[];
  readonly id: string;
  readonly estado: Persona['estado'];
}): T[] {
  return params.personas.map((p) =>
    p.id === params.id ? { ...p, estado: params.estado } : p,
  );
}

export function withoutPersona<T extends Persona>(params: {
  readonly personas: readonly T[];
  readonly id: string;
}): T[] {
  return params.personas.filter((p) => p.id !== params.id);
}
