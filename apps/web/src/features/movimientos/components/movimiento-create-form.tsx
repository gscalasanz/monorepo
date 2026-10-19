'use client';

import { useMemo } from 'react';

import { FormActions } from '@/shared/components/ui/form';
import { cajaOptions, personaOptions } from '@/shared/queries';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import { useMovimientoCreateForm } from '@/features/movimientos/hooks/use-movimiento-create-form';
import type { MovimientoFormOptions } from '@/features/movimientos/services/movimientos-api';
import { CreateMainFields } from '@/features/movimientos/components/create-main-fields';
import { CreateNotesFields } from '@/features/movimientos/components/create-notes-fields';
import { CreatePaymentFields } from '@/features/movimientos/components/create-payment-fields';

interface MovimientoCreateFormProps {
  readonly data: MovimientoFormOptions;
  readonly initialCajaId: string | null;
}

const CARD = 'flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 shadow-xs md:p-6';

/** Form de alta: dos bloques (qué y cómo se pagó) + barra Cancelar / Crear. */
export function MovimientoCreateForm({
  data,
  initialCajaId,
}: MovimientoCreateFormProps) {
  const form = useMovimientoCreateForm({ cajas: data.cajas, initialCajaId });
  const cajas = useMemo(() => cajaOptions(data.cajas), [data.cajas]);
  const personas = useMemo(
    () => personaOptions(data.personas),
    [data.personas],
  );
  return (
    <form
      noValidate
      onSubmit={(event) => void form.submit(event)}
      className="flex flex-col gap-4 md:gap-6"
    >
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2 lg:items-start">
        <div className={CARD}>
          <CreateMainFields form={form} cajaOptions={cajas} />
        </div>
        <div className={CARD}>
          <CreatePaymentFields form={form} personaOptions={personas} />
          <CreateNotesFields form={form} personaOptions={personas} />
        </div>
      </div>
      <FormActions
        onCancel={form.cancel}
        cancelLabel={C.CANCEL}
        saveLabel={C.CREATE_SUBMIT}
        saving={form.saving}
      />
    </form>
  );
}
