import { API_ENDPOINTS, apiClient } from '@/shared/api';
import {
  transferenciaResultSchema,
  type CreateTransferenciaDto,
  type TransferenciaResult,
} from '@/shared/domain';

/** `POST /movimientos/transferencia` → `{ egreso, ingreso }`. */
export function createTransferencia(
  dto: CreateTransferenciaDto,
): Promise<TransferenciaResult> {
  return apiClient.post(API_ENDPOINTS.MOVIMIENTOS_TRANSFERENCIA, {
    body: dto,
    schema: transferenciaResultSchema,
  });
}
