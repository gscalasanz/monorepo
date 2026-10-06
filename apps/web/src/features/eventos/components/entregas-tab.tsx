'use client';

import { Truck } from 'lucide-react';
import { useMemo, useState } from 'react';

import { EmptyState, LoadingState } from '@/shared/components/feedback';
import { TextField } from '@/shared/components/ui/form';
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
    <ul className="flex flex-col gap-2">
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

/** Tab Entregas: búsqueda por persona, fila por vendedor y diálogo de entrega. */
export function EntregasTab(props: EntregasTabProps) {
  const [vendedor, setVendedor] = useState<DialogVendedor>(undefined);
  return (
    <div className="flex flex-col gap-4">
      <TextField
        label={C.searchLabel}
        type="search"
        placeholder={C.searchPlaceholder}
        value={props.search}
        onChange={props.onSearch}
        className="sm:max-w-xs"
      />
      <EntregasList props={props} onRegistrar={setVendedor} />
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
    </div>
  );
}
