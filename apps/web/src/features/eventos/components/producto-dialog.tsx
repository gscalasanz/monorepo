'use client';

import { Package } from 'lucide-react';
import { useId, type FormEvent } from 'react';

import { MoneyField, TextField } from '@/shared/components/ui/form';
import type { Producto } from '@/shared/domain';
import { useFieldValidation, useFormState } from '@/shared/forms';
import { notify } from '@/shared/notifications';
import { EventoDialogShell } from '@/features/eventos/components/evento-dialog-shell';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { EVENTO_LIMITS as L } from '@/features/eventos/constants/eventos';
import {
  INITIAL_PRODUCTO_DRAFT,
  draftFromProducto,
  productoFormSchema,
  toCreateProductoDto,
  toUpdateProductoDto,
  type ProductoFormDraft,
} from '@/features/eventos/helpers/producto-form';
import { useDialogSave } from '@/features/eventos/hooks/use-dialog-save';
import {
  createProducto,
  updateProducto,
} from '@/features/eventos/services/ventas-api';

const C = EVENTOS_COPY.productoDialog;
const P = EVENTOS_COPY.productos;

export interface ProductoDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly eventoId: string;
  /** Presente = edición. */
  readonly producto: Producto | null;
  /** Movimientos habilitados: solo se edita el nombre. */
  readonly preciosBloqueados: boolean;
  readonly onSaved: () => void;
}

async function saveProducto(
  props: ProductoDialogProps,
  draft: ProductoFormDraft,
): Promise<void> {
  if (props.producto) {
    const dto = toUpdateProductoDto({
      draft,
      preciosBloqueados: props.preciosBloqueados,
    });
    await updateProducto({ productoId: props.producto.id, dto });
    notify.success(P.updated);
  } else {
    await createProducto({
      eventoId: props.eventoId,
      dto: toCreateProductoDto(draft),
    });
    notify.success(P.created);
  }
  props.onSaved();
}

interface ProductoFormProps {
  readonly formId: string;
  readonly producto: Producto | null;
  readonly preciosBloqueados: boolean;
  readonly onValid: (draft: ProductoFormDraft) => void;
}

function useProductoForm(producto: Producto | null) {
  const form = useFormState<ProductoFormDraft>(
    producto ? draftFromProducto(producto) : INITIAL_PRODUCTO_DRAFT,
  );
  const validation = useFieldValidation(productoFormSchema);
  const { values } = form;
  return {
    values,
    errors: validation.errors,
    validateAll: () => validation.validateAll(values),
    update: <K extends keyof ProductoFormDraft>(
      name: K,
      value: ProductoFormDraft[K],
    ) => {
      form.setField(name, value);
      validation.onChange(name, value);
    },
    blur: (name: keyof ProductoFormDraft) =>
      validation.onBlur(name, values[name]),
  };
}

type ProductoFormState = ReturnType<typeof useProductoForm>;

function PrecioFields({
  form,
  bloqueados,
}: {
  readonly form: ProductoFormState;
  readonly bloqueados: boolean;
}) {
  const { values, errors } = form;
  return (
    <>
      <MoneyField
        label={C.costo}
        size="md"
        placeholder={C.costoPlaceholder}
        disabled={bloqueados}
        value={values.precioCosto}
        onChange={(value) => form.update('precioCosto', value)}
        onBlur={() => form.blur('precioCosto')}
        error={errors.precioCosto}
      />
      <MoneyField
        label={C.venta}
        size="md"
        required={!bloqueados}
        placeholder={C.ventaPlaceholder}
        disabled={bloqueados}
        value={values.precioVenta}
        onChange={(value) => form.update('precioVenta', value)}
        onBlur={() => form.blur('precioVenta')}
        error={errors.precioVenta}
      />
    </>
  );
}

function ProductoForm({
  formId,
  producto,
  preciosBloqueados,
  onValid,
}: ProductoFormProps) {
  const form = useProductoForm(producto);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.validateAll()) onValid(form.values);
  };
  const bloqueados = Boolean(producto) && preciosBloqueados;
  return (
    <form
      id={formId}
      noValidate
      onSubmit={submit}
      className="flex flex-col gap-4"
    >
      {bloqueados && (
        <p className="rounded-md bg-info-soft px-3 py-2 text-sm text-info">
          {C.congelados}
        </p>
      )}
      <TextField
        label={C.nombre}
        required
        placeholder={C.nombrePlaceholder}
        maxLength={L.PRODUCTO_NOMBRE_MAX}
        value={form.values.nombre}
        onChange={(value) => form.update('nombre', value)}
        onBlur={() => form.blur('nombre')}
        error={form.errors.nombre}
      />
      <PrecioFields form={form} bloqueados={bloqueados} />
    </form>
  );
}

/** "Gestionar Productos" (alta) / "Editar Producto" (edición). */
export function ProductoDialog(props: ProductoDialogProps) {
  const formId = useId();
  const dialog = useDialogSave(props.onOpenChange);
  return (
    <EventoDialogShell
      open={props.open}
      onOpenChange={dialog.handleOpenChange}
      title={props.producto ? C.editTitle : C.createTitle}
      icon={<Package aria-hidden className="size-5 text-ink-muted" />}
      formId={formId}
      cancelLabel={C.cerrar}
      submitLabel={props.producto ? C.guardar : C.agregar}
      saving={dialog.saving}
      error={dialog.error}
    >
      <ProductoForm
        formId={formId}
        producto={props.producto}
        preciosBloqueados={props.preciosBloqueados}
        onValid={(draft) => void dialog.run(() => saveProducto(props, draft))}
      />
    </EventoDialogShell>
  );
}
