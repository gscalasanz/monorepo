/** Form de producto (port de `ProductoEditorComponent`): schema, draft y DTOs. */
import { z } from 'zod';

import type {
  CreateProductoDto,
  Producto,
  UpdateProductoDto,
} from '@/shared/domain';
import { decimalPlaces, positiveNumber, refineWith } from '@/shared/validators';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { EVENTO_LIMITS as L } from '@/features/eventos/constants/eventos';

const C = EVENTOS_COPY.productoDialog;

function isPresent<T>(value: T | null): value is T {
  return value !== null;
}

const precioSchema = z
  .number()
  .nullable()
  .superRefine(refineWith(positiveNumber))
  .superRefine(refineWith(decimalPlaces(L.PRECIO_DECIMALES)));

export const productoFormSchema = z.object({
  nombre: z
    .string()
    .refine((value) => value.trim().length > 0, C.nombreRequerido)
    .refine(
      (value) => value.trim().length >= L.PRODUCTO_NOMBRE_MIN,
      C.nombreMin,
    ),
  /** Opcional: se puede cargar el producto sin costo y completarlo después. */
  precioCosto: precioSchema,
  precioVenta: z
    .number()
    .nullable()
    .refine(isPresent, C.ventaRequerido)
    .pipe(precioSchema),
});

export interface ProductoFormDraft {
  readonly nombre: string;
  readonly precioCosto: number | null;
  readonly precioVenta: number | null;
}

export const INITIAL_PRODUCTO_DRAFT: ProductoFormDraft = {
  nombre: '',
  precioCosto: null,
  precioVenta: null,
};

export function draftFromProducto(producto: Producto): ProductoFormDraft {
  return {
    nombre: producto.nombre,
    precioCosto: producto.precioCosto,
    precioVenta: producto.precioVenta,
  };
}

/** Alta: precioVenta siempre, precioCosto solo si se cargó. */
export function toCreateProductoDto(
  draft: ProductoFormDraft,
): CreateProductoDto {
  return {
    nombre: draft.nombre.trim(),
    precioVenta: draft.precioVenta ?? 0,
    ...(draft.precioCosto === null ? {} : { precioCosto: draft.precioCosto }),
  };
}

/** Edición: con precios congelados (movimientos habilitados) solo viaja el nombre. */
export function toUpdateProductoDto(params: {
  readonly draft: ProductoFormDraft;
  readonly preciosBloqueados: boolean;
}): UpdateProductoDto {
  return params.preciosBloqueados
    ? { nombre: params.draft.nombre.trim() }
    : toCreateProductoDto(params.draft);
}
