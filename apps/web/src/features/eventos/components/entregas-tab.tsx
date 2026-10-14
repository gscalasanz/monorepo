'use client';

import { Truck } from 'lucide-react';
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
import type { Entrega, Evento } from '@/shared/domain';
import { notify } from '@/shared/notifications';
import { EntregaDialog } from '@/features/eventos/components/entrega-dialog';
import { VendedorEntregasRowItem } from '@/features/eventos/components/vendedor-entregas-row';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { buildVendedorRows } from '@/features/eventos/helpers/entregas';
import type { EntregasData } from '@/features/eventos/hooks/use-evento-detail';
import { deleteEntrega } from '@/features/eventos/services/ventas-api';

const C = EVENTOS_COPY.entregas;

export interface EntregasTabProps {
  readonly evento: Evento;
  readonly data: EntregasData | undefined;
  readonly search: string;
  readonly onSearch: (value: string) => void;
  readonly onChanged: () => Promise<void>;
}

/** `undefined` = diálogo cerrado; string = vendedor preseleccionado. */
type DialogVendedor = string | undefined;

function EntregasList({
  props,
  onRegistrar,
}: {
  readonly props: EntregasTabProps;
  readonly onRegistrar: (id: string) => void;
}) {
  const rows = useMemo(
    () =>
      props.data
        ? buildVendedorRows({
            stock: props.data.stock,
            entregas: props.data.entregas,
          })
        : [],
    [props.data],
  );
  const remove = async (entrega: Entrega): Promise<void> => {
    const result = await confirmDialog.runDelete(
      EVENTOS_COPY.entities.entrega,
      {
        action: () =>
          deleteEntrega({ eventoId: props.evento.id, entregaId: entrega.id }),
      },
    );
    if (!result.confirmed) return;
    notify.success(C.deleted);
    await props.onChanged();
  };
  if (!props.data) return <LoadingState />;
  if (rows.length === 0) return <EmptyState icon={Truck} title={C.empty} />;
  return (
    <ul className="divide-y divide-border">
      {rows.map((row) => (
        <VendedorEntregasRowItem
          key={row.vendedorId}
          row={row}
          readonly={props.evento.estaCerrado}
          onRegistrar={onRegistrar}
          onDelete={(entrega) => void remove(entrega)}
        />
      ))}
    </ul>
  );
}

const SEARCH_KEY = 'search';

function EntregasToolbar({ props }: { readonly props: EntregasTabProps }) {
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
        className="min-w-0 flex-1"
      />
    </ListToolbar>
  );
}

/** Tab Entregas: un card con búsqueda por persona, una fila expandible por vendedor y el diálogo de entrega. */
export function EntregasTab(props: EntregasTabProps) {
  const [vendedor, setVendedor] = useState<DialogVendedor>(undefined);
  return (
    <>
      <ListPanel toolbar={<EntregasToolbar props={props} />}>
        <EntregasList props={props} onRegistrar={setVendedor} />
      </ListPanel>
      {vendedor !== undefined && (
        <EntregaDialog
          key={vendedor}
          open
          onOpenChange={(open) => !open && setVendedor(undefined)}
          eventoId={props.evento.id}
          stock={props.data?.stock ?? []}
          vendedorId={vendedor}
          onSaved={() => void props.onChanged()}
        />
      )}
    </>
  );
}
