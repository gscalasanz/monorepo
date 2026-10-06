'use client';

import { Save, Wallet } from 'lucide-react';

import { LoadingState } from '@/shared/components/feedback';
import { TextareaField } from '@/shared/components/ui/form';
import type { CajaConSaldo } from '@/shared/domain';
import { DESCRIPCION_MAX_LENGTH } from '@/features/cajas/constants/cajas';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { DialogActions } from '@/features/cajas/components/dialog-actions';
import { QuickMovimientoMainFields } from '@/features/cajas/components/quick-movimiento-main-fields';
import { QuickMovimientoPagoFields } from '@/features/cajas/components/quick-movimiento-pago-fields';
import { cajaDisplayName } from '@/features/cajas/helpers/quick-movimiento';
import { useQuickMovimientoForm } from '@/features/cajas/hooks/use-quick-movimiento-form';

export interface QuickMovimientoFormProps {
  readonly caja: CajaConSaldo;
  readonly onCancel: () => void;
  readonly onSuccess: () => void;
}

/** Form del movimiento rápido: tipo, concepto, monto, pago y descripción. */
export function QuickMovimientoForm({
  caja,
  onCancel,
  onSuccess,
}: QuickMovimientoFormProps) {
  const form = useQuickMovimientoForm({ caja, onSuccess });
  const { values, validation } = form;

  if (form.loadingPersonas) return <LoadingState label={C.LOADING_DATOS} />;

  return (
    <form
      noValidate
      onSubmit={(event) => void form.submit(event)}
      className="flex flex-col gap-4"
    >
      <p className="flex items-center gap-2 rounded-lg bg-recessed px-3 py-2.5 text-sm font-medium text-ink">
        <Wallet className="size-[18px] text-ink-muted" aria-hidden />
        {cajaDisplayName(caja)}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <QuickMovimientoMainFields form={form} />
        <QuickMovimientoPagoFields form={form} />
      </div>
      <TextareaField
        label={C.DESCRIPCION_OPCIONAL}
        rows={2}
        maxLength={DESCRIPCION_MAX_LENGTH}
        placeholder={C.DESCRIPCION_PLACEHOLDER}
        value={values.descripcion}
        error={validation.errors.descripcion}
        onChange={(value) => form.update('descripcion', value)}
        onBlur={() => validation.onBlur('descripcion', values.descripcion)}
      />
      <DialogActions
        onCancel={onCancel}
        submitLabel={C.REGISTRAR}
        submitIcon={<Save aria-hidden />}
        saving={form.saving}
      />
    </form>
  );
}
