/** Form de evento: schema, draft y mapeo a DTO (port de `EventosFormBuilder`). */
import { z } from 'zod';

import type { FieldOption } from '@/shared/components/ui/form';
import {
  DESTINO_GANANCIA,
  DESTINO_GANANCIA_LABELS,
  MODALIDAD_VENTA,
  MODALIDAD_VENTA_LABELS,
  TIPO_EVENTO,
  TIPO_EVENTO_LABELS,
  type CreateEventoDto,
  type DestinoGanancia,
  type Evento,
  type ModalidadVenta,
  type TipoEvento,
} from '@/shared/domain';
import { refineWith, safeText } from '@/shared/validators';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { EVENTO_LIMITS as L } from '@/features/eventos/constants/eventos';

const C = EVENTOS_COPY.form;

/** Grupo primero, como el select de Angular. */
export const TIPO_OPTIONS: readonly FieldOption<TipoEvento>[] = [
  { value: TIPO_EVENTO.GRUPO, label: TIPO_EVENTO_LABELS.grupo },
  { value: TIPO_EVENTO.VENTA, label: TIPO_EVENTO_LABELS.venta },
];

export const DESTINO_OPTIONS: readonly FieldOption<DestinoGanancia>[] =
  Object.values(DESTINO_GANANCIA).map((value) => ({
    value,
    label: DESTINO_GANANCIA_LABELS[value],
  }));

export const MODALIDAD_OPTIONS: readonly FieldOption<ModalidadVenta>[] =
  Object.values(MODALIDAD_VENTA).map((value) => ({
    value,
    label: MODALIDAD_VENTA_LABELS[value],
  }));

const safeTextRefine = refineWith<string>(safeText);

const optionalText = (max: number) =>
  z.string().max(max, C.maxLength(max)).superRefine(safeTextRefine);

export const eventoFormSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(L.NOMBRE_MIN, C.nombreError)
    .max(L.NOMBRE_MAX, C.maxLength(L.NOMBRE_MAX))
    .superRefine(safeTextRefine),
  tipo: z.nativeEnum(TIPO_EVENTO, {
    errorMap: () => ({ message: C.tipoError }),
  }),
  fecha: z.string().min(1, C.fechaError),
  tipoEvento: optionalText(L.TIPO_EVENTO_MAX),
  modalidadVenta: z.nativeEnum(MODALIDAD_VENTA),
  destinoGanancia: z.nativeEnum(DESTINO_GANANCIA),
  descripcion: optionalText(L.DESCRIPCION_MAX),
});

export interface EventoFormDraft {
  readonly nombre: string;
  readonly tipo: TipoEvento | null;
  readonly fecha: string;
  readonly tipoEvento: string;
  readonly modalidadVenta: ModalidadVenta;
  readonly destinoGanancia: DestinoGanancia;
  readonly descripcion: string;
}

export type EventoFormValues = z.output<typeof eventoFormSchema>;

/** Defaults: modalidad única y destino caja del grupo. */
export const INITIAL_EVENTO_DRAFT: EventoFormDraft = {
  nombre: '',
  tipo: null,
  fecha: '',
  tipoEvento: '',
  modalidadVenta: MODALIDAD_VENTA.UNICA,
  destinoGanancia: DESTINO_GANANCIA.CAJA_GRUPO,
  descripcion: '',
};

export function draftFromEvento(evento: Evento): EventoFormDraft {
  return {
    nombre: evento.nombre,
    tipo: evento.tipo,
    fecha: evento.fecha,
    tipoEvento: evento.tipoEvento ?? '',
    modalidadVenta: evento.modalidadVenta,
    destinoGanancia: evento.destinoGanancia ?? DESTINO_GANANCIA.CAJA_GRUPO,
    descripcion: evento.descripcion ?? '',
  };
}

/**
 * DTO de alta/edición. `destinoGanancia`/`modalidadVenta` solo en venta;
 * `tipoEvento` solo en grupo; vacíos → se omiten. En modalidad mixta se manda
 * igual `destinoGanancia = caja_grupo`: sin eso el backend no genera movimientos.
 */
export function toEventoDto(values: EventoFormValues): CreateEventoDto {
  const esVenta = values.tipo === TIPO_EVENTO.VENTA;
  const destinoGanancia =
    values.modalidadVenta === MODALIDAD_VENTA.MIXTA
      ? DESTINO_GANANCIA.CAJA_GRUPO
      : values.destinoGanancia;
  const descripcion = values.descripcion.trim();
  const tipoEvento = values.tipoEvento.trim();
  return {
    nombre: values.nombre,
    tipo: values.tipo,
    fecha: values.fecha,
    ...(descripcion ? { descripcion } : {}),
    ...(esVenta
      ? { destinoGanancia, modalidadVenta: values.modalidadVenta }
      : {}),
    ...(!esVenta && tipoEvento ? { tipoEvento } : {}),
  };
}
