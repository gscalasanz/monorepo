/**
 * Paginación del backend (`src/common/dtos/paginated-response.dto.ts`).
 * Hoy solo `GET /movimientos` pagina; el resto de los listados son arrays planos.
 */
import { z } from 'zod';

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const paginationMetaSchema = z.object({
  page: z.number().int(),
  limit: z.number().int(),
  total: z.number().int(),
  totalPages: z.number().int(),
  hasPreviousPage: z.boolean(),
  hasNextPage: z.boolean(),
});

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

export interface PaginatedResponse<T> {
  readonly data: T[];
  readonly meta: PaginationMeta;
}

export interface PaginationParams {
  readonly page: number;
  readonly limit: number;
}

/** Schema `{ data: T[], meta }` para un item dado. */
export function paginatedSchema<T extends z.ZodTypeAny>(item: T) {
  return z.object({ data: z.array(item), meta: paginationMetaSchema });
}
