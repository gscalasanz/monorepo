/**
 * Valores iniciales y DTOs de los formularios (port de `PersonasFormBuilder`).
 * Los DTOs se arman desde la salida ya validada por zod.
 */
import type { z } from 'zod';

import type {
  CreateEducadorDto,
  CreatePersonaExternaDto,
  CreateProtagonistaDto,
  Educador,
  PersonaExterna,
  Protagonista,
  UpdatePersonaDto,
} from '@/shared/domain';
import type {
  EducadorFormValues,
  PersonaExternaFormValues,
  ProtagonistaFormValues,
  educadorFormSchema,
  personaExternaFormSchema,
  protagonistaFormSchema,
} from '@/features/personas/models/form-schemas';

export const EMPTY_PROTAGONISTA: ProtagonistaFormValues = {
  nombre: '',
  rama: null,
  partidaNacimiento: false,
  dni: false,
  dniPadres: false,
  carnetObraSocial: false,
};

export const EMPTY_EDUCADOR: EducadorFormValues = {
  nombre: '',
  rama: null,
  cargo: null,
  email: '',
  password: '',
};

export const EMPTY_EXTERNA: PersonaExternaFormValues = {
  nombre: '',
  contacto: '',
  notas: '',
};

export function protagonistaValues(
  persona: Protagonista,
): ProtagonistaFormValues {
  return {
    nombre: persona.nombre,
    rama: persona.rama,
    partidaNacimiento: persona.partidaNacimiento,
    dni: persona.dni,
    dniPadres: persona.dniPadres,
    carnetObraSocial: persona.carnetObraSocial,
  };
}

export function educadorValues(persona: Educador): EducadorFormValues {
  return {
    nombre: persona.nombre,
    rama: persona.rama,
    cargo: persona.cargo,
    email: '',
    password: '',
  };
}

export function externaValues(
  persona: PersonaExterna,
): PersonaExternaFormValues {
  return {
    nombre: persona.nombre,
    contacto: persona.contacto ?? '',
    notas: persona.notas ?? '',
  };
}

/** Crear y editar mandan lo mismo (el DNI de padres se envía aunque se oculte en Rovers). */
export function protagonistaDto(
  parsed: z.output<typeof protagonistaFormSchema>,
): CreateProtagonistaDto & UpdatePersonaDto {
  return { ...parsed };
}

const blankToUndefined = (value: string): string | undefined =>
  value.trim() || undefined;

export function createEducadorDto(
  parsed: z.output<typeof educadorFormSchema>,
): CreateEducadorDto {
  return {
    nombre: parsed.nombre,
    rama: parsed.rama ?? undefined,
    cargo: parsed.cargo,
    email: blankToUndefined(parsed.email),
    password: blankToUndefined(parsed.password),
  };
}

/** Editar educador: sin credenciales (solo se cargan al crear). */
export function updateEducadorDto(
  parsed: z.output<typeof educadorFormSchema>,
): UpdatePersonaDto {
  return {
    nombre: parsed.nombre,
    rama: parsed.rama ?? undefined,
    cargo: parsed.cargo,
  };
}

/** Vacíos → `undefined` (paridad: no se puede "borrar" contacto/notas). */
export function externaDto(
  parsed: z.output<typeof personaExternaFormSchema>,
): CreatePersonaExternaDto & UpdatePersonaDto {
  return {
    nombre: parsed.nombre,
    contacto: parsed.contacto || undefined,
    notas: parsed.notas || undefined,
  };
}
