/**
 * Montos por defecto de inscripción (Scout Argentina / grupo), guardados en
 * `localStorage` con la MISMA clave y formato que `ConfiguracionService` de
 * Angular, para no perder la config de los usuarios. Validado con zod: un campo
 * faltante o inválido cae a 0 sin descartar los demás.
 */
import { z } from 'zod';

import { TIPO_INSCRIPCION, type TipoInscripcion } from '@/shared/domain';
import { readItem, writeItem } from '@/shared/storage';

export const INSCRIPCION_CONFIG_STORAGE_KEY = 'scout_inscripcion_config';

const DEFAULT_MONTO = 0;
const montoSchema = z.number().finite().catch(DEFAULT_MONTO);

export const inscripcionConfigSchema = z.object({
  montoScoutArgentina: montoSchema,
  montoGrupo: montoSchema,
});

export type InscripcionConfig = z.infer<typeof inscripcionConfigSchema>;

export const DEFAULT_INSCRIPCION_CONFIG: InscripcionConfig = {
  montoScoutArgentina: DEFAULT_MONTO,
  montoGrupo: DEFAULT_MONTO,
};

function parseStored(raw: string): InscripcionConfig {
  try {
    const result = inscripcionConfigSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : DEFAULT_INSCRIPCION_CONFIG;
  } catch {
    return DEFAULT_INSCRIPCION_CONFIG;
  }
}

export function loadInscripcionConfig(): InscripcionConfig {
  const raw = readItem('local', INSCRIPCION_CONFIG_STORAGE_KEY);
  return raw ? parseStored(raw) : DEFAULT_INSCRIPCION_CONFIG;
}

/** Devuelve `false` si no se pudo persistir (storage lleno/bloqueado). */
export function saveInscripcionConfig(config: InscripcionConfig): boolean {
  return writeItem('local', {
    key: INSCRIPCION_CONFIG_STORAGE_KEY,
    value: JSON.stringify(config),
  });
}

/** Mezcla un cambio parcial sobre la config guardada, la persiste y la devuelve. */
export function updateInscripcionConfig(
  changes: Partial<InscripcionConfig>,
): InscripcionConfig {
  const next = { ...loadInscripcionConfig(), ...changes };
  saveInscripcionConfig(next);
  return next;
}

export function montoByTipo(
  config: InscripcionConfig,
  tipo: TipoInscripcion,
): number {
  return tipo === TIPO_INSCRIPCION.SCOUT_ARGENTINA
    ? config.montoScoutArgentina
    : config.montoGrupo;
}
