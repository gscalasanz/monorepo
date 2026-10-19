/**
 * "Agregar Participante" (port de `PersonaSelectorDialogComponent` con la
 * config que usa el detalle de campamento): personas activas protagonistas y
 * educadores no inscriptos, bonificación y pago inicial opcionales.
 */
import {
  MEDIO_PAGO,
  PERSONA_TYPE,
  PERSONA_TYPE_LABELS,
  type Persona,
  type PersonaType,
  type Rama,
} from '@/shared/domain';
import type { PagoMedio } from '@/features/campamentos/helpers/pago';

const TIPOS_INSCRIBIBLES: readonly PersonaType[] = [PERSONA_TYPE.PROTAGONISTA, PERSONA_TYPE.EDUCADOR];

export interface CostosCampamento {
  readonly costoPorPersona: number;
  readonly costoEducadores: number;
}

function ramaOf(persona: Persona): Rama | null {
  return 'rama' in persona ? (persona.rama ?? null) : null;
}

/** Protagonistas y educadores, de la rama elegida y no inscriptos. */
export function personasDisponibles(params: {
  readonly personas: readonly Persona[];
  readonly excludeIds: readonly string[];
  readonly rama: Rama | null;
}): readonly Persona[] {
  const excluded = new Set(params.excludeIds);
  return params.personas.filter(
    (p) =>
      TIPOS_INSCRIBIBLES.includes(p.tipo) &&
      (params.rama === null || ramaOf(p) === params.rama) &&
      !excluded.has(p.id),
  );
}

/** "Nombre (Tipo - Rama)" como el selector de Angular. */
export function personaLabel(persona: Persona): string {
  const rama = ramaOf(persona);
  const extra = rama ? ` - ${rama}` : '';
  return `${persona.nombre} (${PERSONA_TYPE_LABELS[persona.tipo]}${extra})`;
}

/** Monto asignado que tendrá la persona: aporte de educadores o costo por persona. */
export function montoMaximoPara(persona: Persona | undefined, camp: CostosCampamento): number {
  if (!persona) return 0;
  return persona.tipo === PERSONA_TYPE.EDUCADOR ? camp.costoEducadores : camp.costoPorPersona;
}

export interface AgregarDraft {
  readonly rama: Rama | null;
  readonly personaId: string | null;
  readonly autorizacionEntregada: boolean;
  readonly montoBonificado: number | null;
  readonly montoPago: number | null;
  readonly medioPago: PagoMedio;
}

export const INITIAL_AGREGAR_DRAFT: AgregarDraft = {
  rama: null,
  personaId: null,
  autorizacionEntregada: false,
  montoBonificado: 0,
  montoPago: 0,
  medioPago: MEDIO_PAGO.EFECTIVO,
};

export interface AgregarState {
  /** Bonificar y pago solo aparecen si la persona tiene costo > 0. */
  readonly montosVisibles: boolean;
  readonly maxBonificable: number;
  readonly bonificado: number;
  readonly maxPago: number;
  readonly pago: number;
  readonly bonificarExcede: boolean;
  readonly pagoExcede: boolean;
  readonly canSubmit: boolean;
}

export function agregarState(draft: AgregarDraft, maxBonificable: number): AgregarState {
  const montosVisibles = maxBonificable > 0;
  const bonificado = montosVisibles ? Math.max(0, draft.montoBonificado ?? 0) : 0;
  const pago = montosVisibles ? Math.max(0, draft.montoPago ?? 0) : 0;
  const maxPago = Math.max(0, maxBonificable - bonificado);
  const bonificarExcede = bonificado > maxBonificable;
  const pagoExcede = pago > maxPago;
  return {
    montosVisibles,
    maxBonificable,
    bonificado,
    maxPago,
    pago,
    bonificarExcede,
    pagoExcede,
    canSubmit: draft.personaId !== null && !bonificarExcede && !pagoExcede,
  };
}

/** Pasos encadenados: alta → bonificación (si > 0) → pago (si > 0). */
export interface InscripcionPlan {
  readonly personaId: string;
  readonly autorizacionEntregada: boolean;
  readonly montoBonificado?: number;
  readonly pago?: { readonly monto: number; readonly medioPago: PagoMedio };
}

export function toInscripcionPlan(draft: AgregarDraft, state: AgregarState): InscripcionPlan | null {
  if (!draft.personaId) return null;
  return {
    personaId: draft.personaId,
    autorizacionEntregada: draft.autorizacionEntregada,
    ...(state.bonificado > 0 && { montoBonificado: state.bonificado }),
    ...(state.pago > 0 && { pago: { monto: state.pago, medioPago: draft.medioPago } }),
  };
}
