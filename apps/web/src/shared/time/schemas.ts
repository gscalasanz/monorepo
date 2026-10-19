/**
 * Schemas zod de fechas para el borde de la API. El backend devuelve las columnas
 * `date` como `YYYY-MM-DD` en GET, pero como ISO de medianoche en POST/PATCH:
 * `localDateSchema` acepta ambas y normaliza a `LocalDate`.
 */
import { z } from 'zod';

import type { Instant, LocalDate } from '@/shared/time/branded';
import {
  parseInstant,
  parseLocalDate,
  resolveBackendDate,
} from '@/shared/time/parse';

const INVALID_DATE_MESSAGE = 'Fecha inválida';

const validDateString = z
  .string()
  .refine((value) => resolveBackendDate(value) !== null, {
    message: INVALID_DATE_MESSAGE,
  });

export const instantSchema: z.ZodType<Instant, z.ZodTypeDef, string> =
  validDateString.transform(parseInstant);

export const localDateSchema: z.ZodType<LocalDate, z.ZodTypeDef, string> =
  validDateString.transform(parseLocalDate);
