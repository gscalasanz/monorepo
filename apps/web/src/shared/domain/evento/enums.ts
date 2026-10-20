/**
 * Enums de evento. La definición vive en `@scout/shared/enums` (única para web y api);
 * acá se re-exporta con el nombre histórico del front (adaptador). Los `*_LABELS` son copy
 * de UI y se quedan en web.
 */
import {
  DestinoGanancia as DESTINO_GANANCIA,
  EstadoCobroVenta as ESTADO_COBRO_VENTA,
  ModalidadVenta as MODALIDAD_VENTA,
  TipoEvento as TIPO_EVENTO,
  type DestinoGanancia,
  type EstadoCobroVenta,
  type ModalidadVenta,
  type TipoEvento,
} from '@scout/shared/enums';

export { DESTINO_GANANCIA, ESTADO_COBRO_VENTA, MODALIDAD_VENTA, TIPO_EVENTO };
export type { DestinoGanancia, EstadoCobroVenta, ModalidadVenta, TipoEvento };

export const TIPO_EVENTO_LABELS: Readonly<Record<TipoEvento, string>> = {
  venta: 'Evento de Venta',
  grupo: 'Evento de Grupo',
};

export const DESTINO_GANANCIA_LABELS: Readonly<
  Record<DestinoGanancia, string>
> = {
  cuentas_personales: 'Cuentas Personales',
  caja_grupo: 'Caja de Grupo',
};

export const MODALIDAD_VENTA_LABELS: Readonly<Record<ModalidadVenta, string>> =
  {
    unica: 'Un solo destino',
    mixta: 'Mixta (destino por venta)',
  };

export const ESTADO_COBRO_VENTA_LABELS: Readonly<
  Record<EstadoCobroVenta, string>
> = {
  cobrado: 'Cobrado',
  pendiente: 'A cobrar',
};
