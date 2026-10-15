'use client';

import { useMemo } from 'react';

import { FormActions } from '@/shared/components/ui/form';
import { personaOptions } from '@/shared/queries';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import { editPersonas } from '@/features/movimientos/helpers/form-mappers';
import { useMovimientoEditForm } from '@/features/movimientos/hooks/use-movimiento-edit-form';
import type { MovimientoEditData } from '@/features/movimientos/services/movimientos-api';
import { EditEditableFields } from '@/features/movimientos/components/edit-editable-fields';
import { MovimientoSummary } from '@/features/movimientos/components/movimiento-summary';

const CARD =
  'flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 shadow-xs md:p-6';

/** Form de edición: dos bloques (datos de solo lectura y campos editables), como el alta. */
export function MovimientoEditForm({
  data,
}: {
  readonly data: MovimientoEditData;
}) {
  const { movimiento } = data;
  const options = useMemo(() => personaOptions(editPersonas(data)), [data]);
  const selectableIds = useMemo(
    () => new Set(options.map((option) => option.value)),
    [options],
  );
  const form = useMovimientoEditForm({ movimiento, selectableIds });
  return (
    <form
      noValidate
      onSubmit={(event) => void form.submit(event)}
      className="flex flex-col gap-4 md:gap-6"
    >
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2 lg:items-start">
        <div className={CARD}>
          <MovimientoSummary movimiento={movimiento} />
        </div>
        <section aria-labelledby="movimiento-editable-title" className={CARD}>
          <EditEditableFields
            form={form}
            personaOptions={options}
            originalEstado={movimiento.estadoPago}
          />
        </section>
      </div>
      <FormActions
        onCancel={form.cancel}
        cancelLabel={C.CANCEL}
        saveLabel={C.EDIT_SUBMIT}
        saving={form.saving}
      />
    </form>
  );
}
