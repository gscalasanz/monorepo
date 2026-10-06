/**
 * Schemas de los formularios de personas (reglas de `personas-form.builder.ts`):
 * nombre 2–100 + safeText; rama requerida (protagonista); cargo requerido
 * (educador); email válido y password ≥6 opcionales pero vinculados.
 */
import { z } from 'zod';

import {
  CARGO_EDUCADOR,
  RAMA,
  type CargoEducador,
  type Rama,
} from '@/shared/domain';
import {
  credencialesCompletas,
  refineWith,
  safeText,
} from '@/shared/validators';
import {
  EDUCADOR_FORM_COPY as E,
  EXTERNA_FORM_COPY as X,
  FORM_COPY as F,
} from '@/features/personas/constants/form-copy';
import { PERSONA_LIMITS as L } from '@/features/personas/constants/personas';

const nombre = z
  .string()
  .trim()
  .min(L.NOMBRE_MIN, F.NOMBRE_ERROR)
  .max(L.NOMBRE_MAX, F.NOMBRE_ERROR)
  .superRefine(refineWith(safeText));

const ramaRequerida = z.nativeEnum(RAMA, {
  errorMap: () => ({ message: F.RAMA_REQUIRED }),
});

export const protagonistaFormSchema = z.object({
  nombre,
  rama: ramaRequerida,
  partidaNacimiento: z.boolean(),
  dni: z.boolean(),
  dniPadres: z.boolean(),
  carnetObraSocial: z.boolean(),
});

export interface ProtagonistaFormValues {
  readonly nombre: string;
  readonly rama: Rama | null;
  readonly partidaNacimiento: boolean;
  readonly dni: boolean;
  readonly dniPadres: boolean;
  readonly carnetObraSocial: boolean;
}

export const educadorFormSchema = z.object({
  nombre,
  rama: z.nativeEnum(RAMA).nullable(),
  cargo: z.nativeEnum(CARGO_EDUCADOR, {
    errorMap: () => ({ message: E.CARGO_REQUIRED }),
  }),
  email: z.union([z.literal(''), z.string().trim().email(E.EMAIL_INVALID)]),
  password: z.union([
    z.literal(''),
    z.string().min(L.PASSWORD_MIN, E.PASSWORD_MIN),
  ]),
});

export interface EducadorFormValues {
  readonly nombre: string;
  readonly rama: Rama | null;
  readonly cargo: CargoEducador | null;
  readonly email: string;
  readonly password: string;
}

export interface CredencialesErrors {
  readonly email?: string;
  readonly password?: string;
}

/** Email y contraseña van juntos: marca el que falta (mismo copy que Angular). */
export function credencialesErrors(
  values: Pick<EducadorFormValues, 'email' | 'password'>,
): CredencialesErrors {
  if (credencialesCompletas(values) === null) return {};
  return values.email.trim()
    ? { password: E.PASSWORD_REQUIRED }
    : { email: E.EMAIL_REQUIRED };
}

export const personaExternaFormSchema = z.object({
  nombre,
  contacto: z.string().max(L.CONTACTO_MAX, X.CONTACTO_MAX),
  notas: z.string(),
});

export interface PersonaExternaFormValues {
  readonly nombre: string;
  readonly contacto: string;
  readonly notas: string;
}

