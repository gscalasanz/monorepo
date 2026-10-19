/** Llamadas HTTP del módulo cajas (port de `CajasApiService` + lo que usaba de `MovimientosApiService`). */
import { API_ENDPOINTS, apiClient, type QueryParams } from '@/shared/api';
import {
  CAJA_TYPE,
  FONDO_RAMA_TYPES,
  cajaResponseSchema,
  cajaSchema,
  cajasResponseSchema,
  consolidadoSaldosSchema,
  movimientoSchema,
  movimientosPaginatedSchema,
  movimientosSchema,
  transferenciaResultSchema,
  type CajaConSaldo,
  type CajasQuery,
  type ConsolidadoSaldos,
  type CreateMovimientoDto,
  type CreateTransferenciaDto,
  type FondoRamaType,
  type FondoSolidario,
  type Movimiento,
  type TransferenciaResult,
} from '@/shared/domain';
import { fetchFondoSolidario } from '@/shared/queries';
import { FONDO_SOLIDARIO_NOMBRE } from '@/features/cajas/constants/cajas';

/** `GET /cajas?tipo&rama` */
export function fetchCajasBy(
  query: CajasQuery,
  signal?: AbortSignal,
): Promise<readonly CajaConSaldo[]> {
  return apiClient.get(API_ENDPOINTS.CAJAS, {
    schema: cajasResponseSchema,
    params: { ...query },
    signal,
  });
}

/** `GET /movimientos/caja/:id` (orden fecha DESC). */
export function fetchMovimientosCaja(
  cajaId: string,
  signal?: AbortSignal,
): Promise<readonly Movimiento[]> {
  return apiClient.get(API_ENDPOINTS.movimientosCaja(cajaId), {
    schema: movimientosSchema,
    signal,
  });
}

export interface CajaGrupoData {
  readonly caja: CajaConSaldo;
  readonly movimientos: readonly Movimiento[];
}

/** `GET /cajas/grupo` + sus movimientos. */
export async function fetchCajaGrupoData(
  signal: AbortSignal,
): Promise<CajaGrupoData> {
  const caja = await apiClient.get(API_ENDPOINTS.CAJAS_GRUPO, {
    schema: cajaResponseSchema,
    signal,
  });
  const movimientos = await fetchMovimientosCaja(caja.id, signal);
  return { caja, movimientos };
}

export type FondosRamaMap = Readonly<
  Partial<Record<FondoRamaType, CajaConSaldo>>
>;

/** Un `GET /cajas?tipo=rama_x` por rama; se queda con la primera de cada tipo. */
export async function fetchFondosRama(
  signal: AbortSignal,
): Promise<FondosRamaMap> {
  const results = await Promise.all(
    FONDO_RAMA_TYPES.map(async (tipo) => {
      const [caja] = await fetchCajasBy({ tipo }, signal);
      return [tipo, caja] as const;
    }),
  );
  return Object.fromEntries(results.filter(([, caja]) => caja !== undefined));
}

/** `GET /movimientos` paginado (solo la página pedida). */
export async function fetchMovimientosFiltrados(
  params: QueryParams,
  signal: AbortSignal,
): Promise<readonly Movimiento[]> {
  const { data } = await apiClient.get(API_ENDPOINTS.MOVIMIENTOS, {
    schema: movimientosPaginatedSchema,
    params,
    signal,
  });
  return data;
}

/** `GET /cajas?tipo=personal[&rama]`. */
export function fetchCuentasPersonales(
  rama: CajasQuery['rama'],
  signal: AbortSignal,
): Promise<readonly CajaConSaldo[]> {
  return fetchCajasBy({ tipo: CAJA_TYPE.PERSONAL, rama }, signal);
}

export interface FondoSolidarioData {
  readonly consolidado: ConsolidadoSaldos;
  readonly fondo: FondoSolidario;
  readonly movimientos: readonly Movimiento[];
}

/** Consolidado + fondo solidario + movimientos de su caja (si existe). */
export async function fetchFondoSolidarioData(
  signal: AbortSignal,
): Promise<FondoSolidarioData> {
  const [consolidado, fondo] = await Promise.all([
    apiClient.get(API_ENDPOINTS.CAJAS_CONSOLIDADO, {
      schema: consolidadoSaldosSchema,
      signal,
    }),
    fetchFondoSolidario(signal),
  ]);
  const movimientos = fondo.caja
    ? await fetchMovimientosCaja(fondo.caja.id, signal)
    : [];
  return { consolidado, fondo, movimientos };
}

/** `POST /cajas {tipo:'fondo_solidario', nombre:'Fondo Solidario'}`. */
export async function createFondoSolidario(): Promise<void> {
  await apiClient.post(API_ENDPOINTS.CAJAS, {
    body: { tipo: CAJA_TYPE.FONDO_SOLIDARIO, nombre: FONDO_SOLIDARIO_NOMBRE },
    schema: cajaSchema,
  });
}

/** `POST /movimientos`. */
export function createMovimiento(
  dto: CreateMovimientoDto,
): Promise<Movimiento> {
  return apiClient.post(API_ENDPOINTS.MOVIMIENTOS, {
    body: dto,
    schema: movimientoSchema,
  });
}

/** `POST /movimientos/transferencia` → `{ egreso, ingreso }`. */
export function createTransferencia(
  dto: CreateTransferenciaDto,
): Promise<TransferenciaResult> {
  return apiClient.post(API_ENDPOINTS.MOVIMIENTOS_TRANSFERENCIA, {
    body: dto,
    schema: transferenciaResultSchema,
  });
}

/** `DELETE /movimientos/:id` (en una transferencia borra también la contraparte). */
export function deleteMovimiento(id: string): Promise<void> {
  return apiClient.delete(API_ENDPOINTS.movimiento(id));
}
