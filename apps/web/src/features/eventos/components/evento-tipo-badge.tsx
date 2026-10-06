import { Store, Users } from 'lucide-react';

import { StatusBadge } from '@/shared/components/data';
import {
  TIPO_EVENTO,
  TIPO_EVENTO_LABELS,
  type TipoEvento,
} from '@/shared/domain';

/** Badge "Evento de Venta" / "Evento de Grupo" (ícono + texto, nunca solo color). */
export function EventoTipoBadge({ tipo }: { readonly tipo: TipoEvento }) {
  const isVenta = tipo === TIPO_EVENTO.VENTA;
  return (
    <StatusBadge
      label={TIPO_EVENTO_LABELS[tipo] ?? tipo}
      tone={isVenta ? 'brand' : 'info'}
      icon={isVenta ? Store : Users}
    />
  );
}
