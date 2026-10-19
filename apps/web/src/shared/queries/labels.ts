/** Etiquetas para selectores de personas y cajas (paridad con los forms de Angular). */
import { CAJA_TYPE, CAJA_TYPE_LABELS, type CajaConSaldo, type Persona } from '@/shared/domain';

const SHORT_ID_LENGTH = 8;

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

/** Nombre visible de una caja: `nombre`, o según tipo ("Cuenta de X", "Fondo Manada"…), o "Caja {id8}". */
export function cajaLabel(caja: CajaConSaldo): string {
  if (caja.nombre) return caja.nombre;
  if (caja.tipo === CAJA_TYPE.PERSONAL) {
    return caja.propietario ? `Cuenta de ${caja.propietario.nombre}` : CAJA_TYPE_LABELS.personal;
  }
  return CAJA_TYPE_LABELS[caja.tipo] ?? `Caja ${caja.id.slice(0, SHORT_ID_LENGTH)}`;
}

export function cajaOptions(cajas: readonly CajaConSaldo[]): readonly SelectOption[] {
  return cajas.map((caja) => ({ value: caja.id, label: cajaLabel(caja) }));
}

/** Opciones de persona por nombre, ordenadas alfabéticamente (es-AR). */
export function personaOptions(personas: readonly Persona[]): readonly SelectOption[] {
  return [...personas]
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
    .map((persona) => ({ value: persona.id, label: persona.nombre }));
}
