'use client';

import { ListChecks, Receipt, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';

import { EmptyState, LoadingState } from '@/shared/components/feedback';
import { TextField } from '@/shared/components/ui/form';
import { confirmDialog } from '@/shared/confirm';
import type { DeleteVentaResult, Evento } from '@/shared/domain';
import { notify } from '@/shared/notifications';
import { ButtonLink } from '@/features/eventos/components/button-link';
import { VentaGroupCard } from '@/features/eventos/components/venta-group-card';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { EVENTOS_ROUTES } from '@/features/eventos/constants/eventos';
import { groupVentasByLote } from '@/features/eventos/helpers/venta-groups';
import type {
  VentaGroup,
  VentaListado,
} from '@/features/eventos/models/eventos';
import {
  cobrarVenta,
  deleteVenta,
} from '@/features/eventos/services/ventas-api';

const C = EVENTOS_COPY.ventas;

export interface VentasTabProps {
  readonly evento: Evento;
  readonly ventas: readonly VentaListado[] | undefined;
  readonly search: string;
  readonly onSearch: (value: string) => void;
  readonly onChanged: () => Promise<void>;
}

function deletedMessage(result: DeleteVentaResult | null): string {
  return result && result.hermanasEliminadas > 0
    ? C.deletedLote(result.hermanasEliminadas)
    : C.deleted;
}

function useVentaActions({
  evento,
  onChanged,
}: Pick<VentasTabProps, 'evento' | 'onChanged'>) {
  const [cobrandoId, setCobrandoId] = useState<string | null>(null);

  const remove = async (group: VentaGroup): Promise<void> => {
    let deleted: DeleteVentaResult | null = null;
    const result = await confirmDialog.runDelete(EVENTOS_COPY.entities.venta, {
      action: async () => {
        deleted = await deleteVenta({
          eventoId: evento.id,
          ventaId: group.primaryVentaId,
        });
      },
    });
    if (!result.confirmed) return;
    notify.success(deletedMessage(deleted));
    await onChanged();
  };

  /** Sin toast (paridad): el lote entero pasa a cobrado y se refresca todo. */
  const cobrar = async (group: VentaGroup): Promise<void> => {
    if (cobrandoId) return;
    setCobrandoId(group.primaryVentaId);
    try {
      await cobrarVenta({ eventoId: evento.id, ventaId: group.primaryVentaId });
      await onChanged();
    } catch {
      // 409 "La venta ya figura como cobrada" → lo muestra el toast global.
    } finally {
      setCobrandoId(null);
    }
  };

  return { cobrandoId, remove, cobrar };
}

function VentasList({ props }: { readonly props: VentasTabProps }) {
  const groups = useMemo(
    () => groupVentasByLote(props.ventas ?? []),
    [props.ventas],
  );
  const actions = useVentaActions(props);
  if (props.ventas === undefined) return <LoadingState />;
  if (groups.length === 0)
    return (
      <EmptyState icon={Receipt} title={C.emptyTitle} hint={C.emptyHint} />
    );
  return (
    <section className="flex flex-col gap-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
        <ListChecks aria-hidden className="size-4 text-ink-muted" />
        {C.registradas}
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <VentaGroupCard
            key={group.key}
            group={group}
            readonly={props.evento.estaCerrado}
            cobrando={actions.cobrandoId === group.primaryVentaId}
            onDelete={(g) => void actions.remove(g)}
            onCobrar={(g) => void actions.cobrar(g)}
          />
        ))}
      </div>
    </section>
  );
}

/** Tab Ventas: búsqueda por vendedor (al backend), lotes, cobro y borrado en cascada. */
export function VentasTab(props: VentasTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <TextField
          label={C.searchLabel}
          type="search"
          placeholder={C.searchPlaceholder}
          value={props.search}
          onChange={props.onSearch}
          className="sm:max-w-xs sm:flex-1"
        />
        {!props.evento.estaCerrado && (
          <ButtonLink
            href={EVENTOS_ROUTES.ventasLote(props.evento.id)}
            icon={<ShoppingCart aria-hidden />}
          >
            {C.registrarLote}
          </ButtonLink>
        )}
      </div>
      <VentasList props={props} />
    </div>
  );
}
