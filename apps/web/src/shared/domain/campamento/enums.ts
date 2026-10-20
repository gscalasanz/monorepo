/**
 * Enums de campamento. La definición vive en `@scout/shared/enums` (única para web y api);
 * acá se re-exporta con el nombre histórico del front (adaptador). Los `*_LABELS` son copy
 * de UI y se quedan en web.
 */
import {
  EstadoPagoCampamento as ESTADO_PAGO_CAMPAMENTO,
  type EstadoPagoCampamento,
} from '@scout/shared/enums';

export { ESTADO_PAGO_CAMPAMENTO };
export type { EstadoPagoCampamento };

export const ESTADO_PAGO_CAMPAMENTO_LABELS: Readonly<
  Record<EstadoPagoCampamento, string>
> = {
  pendiente: 'Pendiente',
  parcial: 'Pago Parcial',
  pagado: 'Pagado',
  exento: 'Exento',
};
