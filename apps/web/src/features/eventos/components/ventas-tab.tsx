'use client';

import { Receipt, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  FilterBar,
  ListPanel,
  ListToolbar,
  stringValue,
  type FilterField,
} from '@/shared/components/data';
import { EmptyState, LoadingState } from '@/shared/components/feedback';
import { confirmDialog } from '@/shared/confirm';
import type { DeleteVentaResult, Evento } from '@/shared/domain';
import { notify } from '@/shared/notifications';
import { ButtonLink } from '@/features/eventos/components/button-link';
import { VentasTable } from '@/features/eventos/components/ventas-table';
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

function VentasBody({ props }: { readonly props: VentasTabProps }) {
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
    <VentasTable
      groups={groups}
      readonly={props.evento.estaCerrado}
      cobrandoId={actions.cobrandoId}
      onDelete={(g) => void actions.remove(g)}
      onCobrar={(g) => void actions.cobrar(g)}
    />
  );
}

const SEARCH_KEY = 'search';

function VentasToolbar({ props }: { readonly props: VentasTabProps }) {
  const fields: readonly FilterField[] = [
    {
      key: SEARCH_KEY,
      type: 'search',
      label: C.searchLabel,
      placeholder: C.searchPlaceholder,
    },
  ];
  return (
    <ListToolbar>
      <FilterBar
        fields={fields}
        value={{ [SEARCH_KEY]: props.search || undefined }}
        onChange={(values) => props.onSearch(stringValue(values[SEARCH_KEY]))}
        className="min-w-0 basis-full md:basis-0 md:flex-1"
      />
      {!props.evento.estaCerrado && (
        <ButtonLink
          href={EVENTOS_ROUTES.ventasLote(props.evento.id)}
          icon={<ShoppingCart aria-hidden />}
        >
          {C.registrarLote}
        </ButtonLink>
      )}
    </ListToolbar>
  );
}

/** Tab Ventas: un card con búsqueda por vendedor (al backend) y registro en lote arriba, y la tabla de lotes. */
export function VentasTab(props: VentasTabProps) {
  return (
    <ListPanel toolbar={<VentasToolbar props={props} />}>
      <VentasBody props={props} />
    </ListPanel>
  );
}
