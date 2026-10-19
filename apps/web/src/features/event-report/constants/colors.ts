/** Colores del reporte: SOLO variables CSS de tokens (light/dark las resuelve el CSS). */
import { PERSONA_TYPE, type PersonaType } from '@/shared/domain';

/** Educadores vs. protagonistas (ranking, por tipo, rama "Educadores"). */
export const PERSONA_COLORS = {
  educador: 'var(--color-data-3)',
  protagonista: 'var(--color-data-1)',
} as const;

/** Rama → token de color (el `grupo` del backend llega con el nombre de la rama). */
export const RAMA_COLORS: Readonly<Record<string, string>> = {
  Manada: 'var(--color-rama-manada)',
  Unidad: 'var(--color-rama-unidad)',
  Caminantes: 'var(--color-rama-caminantes)',
  Rovers: 'var(--color-rama-rovers)',
};

export function isEducador(tipo: PersonaType): boolean {
  return tipo === PERSONA_TYPE.EDUCADOR;
}

export function personaColor(tipo: PersonaType): string {
  return isEducador(tipo)
    ? PERSONA_COLORS.educador
    : PERSONA_COLORS.protagonista;
}
