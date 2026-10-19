/** HTTP de productos, ventas y entregas de un evento de venta. */
import { API_ENDPOINTS, apiClient } from '@/shared/api';
import {
  cobrarVentaResultSchema,
  deleteVentaResultSchema,
  entregasSchema,
  personasSchema,
  productoSchema,
  stockEntregasSchema,
  type CobrarVentaResult,
  type CreateEntregaDto,
  type CreateProductoDto,
  type DeleteVentaResult,
  type Entrega,
  type Persona,
  type Producto,
  type RegisterVentasLoteDto,
  type StockEntrega,
  type UpdateProductoDto,
} from '@/shared/domain';
import { VENDEDOR_QUERY_PARAM } from '@/features/eventos/constants/eventos';
import {
  productoConVentasSchema,
  ventasListadoSchema,
  type ProductoConVentas,
  type VentaListado,
} from '@/features/eventos/models/eventos';

const productosConVentasSchema = productoConVentasSchema.array();

/** Filtro por nombre de vendedor (se omite si está vacío). */
function vendedorParams(vendedor?: string) {
  const trimmed = vendedor?.trim();
  return trimmed ? { [VENDEDOR_QUERY_PARAM]: trimmed } : undefined;
}

export interface EventoQuery {
  readonly eventoId: string;
  readonly vendedor?: string;
  readonly signal?: AbortSignal;
}

export function fetchProductos(
  eventoId: string,
  signal?: AbortSignal,
): Promise<readonly ProductoConVentas[]> {
  return apiClient.get(API_ENDPOINTS.eventoProductos(eventoId), {
    schema: productosConVentasSchema,
    signal,
  });
}

export function createProducto(params: {
  readonly eventoId: string;
  readonly dto: CreateProductoDto;
}): Promise<Producto> {
  return apiClient.post(API_ENDPOINTS.eventoProductos(params.eventoId), {
    body: params.dto,
    schema: productoSchema,
  });
}

/** `PATCH /eventos/productos/:productoId` (sin eventoId en la ruta). */
export function updateProducto(params: {
  readonly productoId: string;
  readonly dto: UpdateProductoDto;
}): Promise<Producto> {
  return apiClient.patch(API_ENDPOINTS.producto(params.productoId), {
    body: params.dto,
    schema: productoSchema,
  });
}

export function deleteProducto(productoId: string): Promise<void> {
  return apiClient.delete(API_ENDPOINTS.producto(productoId));
}

export function fetchVentas({
  eventoId,
  vendedor,
  signal,
}: EventoQuery): Promise<readonly VentaListado[]> {
  return apiClient.get(API_ENDPOINTS.eventoVentas(eventoId), {
    schema: ventasListadoSchema,
    params: vendedorParams(vendedor),
    signal,
  });
}

export function registrarVentasLote(params: {
  readonly eventoId: string;
  readonly dto: RegisterVentasLoteDto;
}): Promise<void> {
  return apiClient.post(API_ENDPOINTS.eventoVentasLote(params.eventoId), {
    body: params.dto,
  });
}

/** Si la venta es de un lote, el backend borra también las hermanas. */
export function deleteVenta(params: {
  readonly eventoId: string;
  readonly ventaId: string;
}): Promise<DeleteVentaResult> {
  return apiClient.delete(
    API_ENDPOINTS.eventoVenta(params.eventoId, params.ventaId),
    {
      schema: deleteVentaResultSchema,
    },
  );
}

/** Cobra el lote completo (comparte el movimiento agregado). */
export function cobrarVenta(params: {
  readonly eventoId: string;
  readonly ventaId: string;
}): Promise<CobrarVentaResult> {
  return apiClient.post(
    API_ENDPOINTS.eventoVentaCobrar(params.eventoId, params.ventaId),
    {
      body: {},
      schema: cobrarVentaResultSchema,
    },
  );
}

/** Único listado que incluye la agrupación "Grupo Scout". */
export function fetchVendedoresElegibles(
  signal?: AbortSignal,
): Promise<readonly Persona[]> {
  return apiClient.get(API_ENDPOINTS.PERSONAS_VENDEDORES_ELEGIBLES, {
    schema: personasSchema,
    signal,
  });
}

export function fetchEntregas({
  eventoId,
  vendedor,
  signal,
}: EventoQuery): Promise<readonly Entrega[]> {
  return apiClient.get(API_ENDPOINTS.eventoEntregas(eventoId), {
    schema: entregasSchema,
    params: vendedorParams(vendedor),
    signal,
  });
}

export function fetchStockEntregas({
  eventoId,
  vendedor,
  signal,
}: EventoQuery): Promise<readonly StockEntrega[]> {
  return apiClient.get(API_ENDPOINTS.eventoEntregasStock(eventoId), {
    schema: stockEntregasSchema,
    params: vendedorParams(vendedor),
    signal,
  });
}

export function createEntrega(params: {
  readonly eventoId: string;
  readonly dto: CreateEntregaDto;
}): Promise<void> {
  return apiClient.post(API_ENDPOINTS.eventoEntregas(params.eventoId), {
    body: params.dto,
  });
}

export function deleteEntrega(params: {
  readonly eventoId: string;
  readonly entregaId: string;
}): Promise<void> {
  return apiClient.delete(
    API_ENDPOINTS.eventoEntrega(params.eventoId, params.entregaId),
  );
}
