/**
 * Persona (STI, discriminada por `tipo`) tal como la serializa el backend
 * (`personas/entities/persona.entity.ts`). Cada subtipo trae solo sus columnas.
 * zod descarta claves fuera del contrato (p. ej. el `passwordHash` que filtra
 * `POST /personas/educadores`).
 */
import { z } from 'zod';

import { baseEntityShape, nullableField } from '@/shared/domain/common';
import {
  CARGO_EDUCADOR,
  ESTADO_PERSONA,
  PERSONA_TYPE,
  RAMA,
} from '@/shared/domain/persona/enums';

export const personaTypeSchema = z.nativeEnum(PERSONA_TYPE);
export const estadoPersonaSchema = z.nativeEnum(ESTADO_PERSONA);
export const ramaSchema = z.nativeEnum(RAMA);
export const cargoEducadorSchema = z.nativeEnum(CARGO_EDUCADOR);

const personaBaseShape = {
  ...baseEntityShape,
  nombre: z.string(),
  estado: estadoPersonaSchema,
  email: nullableField(z.string()),
  emailVerified: z.boolean().optional(),
};

export const protagonistaSchema = z.object({
  ...personaBaseShape,
  tipo: z.literal(PERSONA_TYPE.PROTAGONISTA),
  rama: ramaSchema,
  partidaNacimiento: z.boolean(),
  dni: z.boolean(),
  dniPadres: z.boolean(),
  carnetObraSocial: z.boolean(),
});

export const educadorSchema = z.object({
  ...personaBaseShape,
  tipo: z.literal(PERSONA_TYPE.EDUCADOR),
  rama: nullableField(ramaSchema),
  cargo: cargoEducadorSchema,
});

export const personaExternaSchema = z.object({
  ...personaBaseShape,
  tipo: z.literal(PERSONA_TYPE.EXTERNA),
  contacto: nullableField(z.string()),
  notas: nullableField(z.string()),
});

export const agrupacionSchema = z.object({
  ...personaBaseShape,
  tipo: z.literal(PERSONA_TYPE.AGRUPACION),
  descripcion: nullableField(z.string()),
});

export const personaSchema = z.discriminatedUnion('tipo', [
  protagonistaSchema,
  educadorSchema,
  personaExternaSchema,
  agrupacionSchema,
]);

export const personasSchema = z.array(personaSchema);

export type Protagonista = z.infer<typeof protagonistaSchema>;
export type Educador = z.infer<typeof educadorSchema>;
export type PersonaExterna = z.infer<typeof personaExternaSchema>;
export type Agrupacion = z.infer<typeof agrupacionSchema>;
export type Persona = z.infer<typeof personaSchema>;

/** `POST /personas/:id/transferir-saldo-a-grupo` */
export const transferirSaldoResultSchema = z.object({
  saldoTransferido: z.number(),
});
export type TransferirSaldoResult = z.infer<typeof transferirSaldoResultSchema>;
