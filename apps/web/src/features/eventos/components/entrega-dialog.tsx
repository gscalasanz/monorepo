'use client';

import { Truck } from 'lucide-react';
import { useId, useMemo, useState, type FormEvent } from 'react';

import { SelectField, TextField } from '@/shared/components/ui/form';
import type { CreateEntregaDto, StockEntrega } from '@/shared/domain';
import { notify } from '@/shared/notifications';
import { EntregaProductosTable } from '@/features/eventos/components/entrega-productos-table';
import { EventoDialogShell } from '@/features/eventos/components/evento-dialog-shell';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { EVENTO_LIMITS as L } from '@/features/eventos/constants/eventos';
import {
  canSubmitEntrega,
  entregaItems,
  productosDisponibles,
  vendedorOptions,
} from '@/features/eventos/helpers/entregas';
import type { Cantidades } from '@/features/eventos/helpers/ventas-lote';
import { useDialogSave } from '@/features/eventos/hooks/use-dialog-save';
import { createEntrega } from '@/features/eventos/services/ventas-api';

const C = EVENTOS_COPY.entregaDialog;

export interface EntregaDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly eventoId: string;
  readonly stock: readonly StockEntrega[];
  /** Vendedor fijo (desde su fila) o `null` para elegirlo. */
  readonly vendedorId: string | null;
  readonly onSaved: () => void;
}

function useEntregaForm(
  stock: readonly StockEntrega[],
  initialVendedor: string | null,
) {
  const [vendedorId, setVendedorId] = useState<string | null>(initialVendedor);
  const [cantidades, setCantidades] = useState<Cantidades>({});
  const [notas, setNotas] = useState('');
  const productos = useMemo(
    () => productosDisponibles({ stock, vendedorId }),
    [stock, vendedorId],
  );
  return {
    vendedorId,
    cantidades,
    notas,
    productos,
    canSubmit: canSubmitEntrega({ productos, cantidades }),
    setNotas,
    selectVendedor: (id: string | null) => {
      setVendedorId(id);
      setCantidades({});
    },
    setCantidad: (productoId: string, value: number | null) =>
      setCantidades((prev) => ({ ...prev, [productoId]: value })),
  };
}

type EntregaForm = ReturnType<typeof useEntregaForm>;

function toDto(form: EntregaForm): CreateEntregaDto | null {
  const items = entregaItems(form);
  const notas = form.notas.trim();
  if (!form.vendedorId || items.length === 0) return null;
  return { vendedorId: form.vendedorId, items, ...(notas ? { notas } : {}) };
}

function VendedorField({
  form,
  stock,
  fijo,
}: {
  readonly form: EntregaForm;
  readonly stock: readonly StockEntrega[];
  readonly fijo: boolean;
}) {
  if (fijo) {
    const nombre =
      stock.find((row) => row.vendedorId === form.vendedorId)?.vendedorNombre ??
      '';
    return (
      <p className="flex flex-col text-sm">
        <span className="text-[13px] text-ink-muted">{C.vendedor}</span>
        <span className="font-semibold text-ink">{nombre}</span>
      </p>
    );
  }
  return (
    <SelectField
      label={C.vendedor}
      required
      placeholder={C.vendedorPlaceholder}
      options={vendedorOptions(stock)}
      value={form.vendedorId}
      onChange={form.selectVendedor}
    />
  );
}

async function saveEntrega({
  props,
  dto,
}: {
  readonly props: EntregaDialogProps;
  readonly dto: CreateEntregaDto;
}) {
  await createEntrega({ eventoId: props.eventoId, dto });
  notify.success(EVENTOS_COPY.entregas.created);
  props.onSaved();
}

/** "Registrar entrega": cantidades ≤ stock disponible del vendedor + notas. */
export function EntregaDialog(props: EntregaDialogProps) {
  const formId = useId();
  const dialog = useDialogSave(props.onOpenChange);
  const form = useEntregaForm(props.stock, props.vendedorId);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dto = toDto(form);
    if (dto && form.canSubmit)
      void dialog.run(() => saveEntrega({ props, dto }));
  };
  return (
    <EventoDialogShell
      open={props.open}
      onOpenChange={dialog.handleOpenChange}
      title={C.title}
      icon={<Truck aria-hidden className="size-5 text-ink-muted" />}
      formId={formId}
      cancelLabel={C.cancelar}
      submitLabel={dialog.saving ? C.saving : C.title}
      saving={dialog.saving}
      submitDisabled={!form.canSubmit}
      error={dialog.error}
    >
      <form
        id={formId}
        noValidate
        onSubmit={submit}
        className="flex flex-col gap-4"
      >
        <VendedorField
          form={form}
          stock={props.stock}
          fijo={props.vendedorId !== null}
        />
        {form.vendedorId && <EntregaProductosTable form={form} />}
        <TextField
          label={C.notas}
          helper={C.notasHint}
          placeholder={C.notasPlaceholder}
          maxLength={L.NOTAS_MAX}
          value={form.notas}
          onChange={form.setNotas}
        />
      </form>
    </EventoDialogShell>
  );
}
