'use client';

import { useMemo, useState, type FormEvent } from 'react';

import type { CajaConSaldo } from '@/shared/domain';
import { useAsyncData } from '@/shared/hooks';
import { notify } from '@/shared/notifications';
import { fetchPersonasActivas, personaOptions } from '@/shared/queries';
import { personaAReembolsarRequerida } from '@/shared/validators';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { buildQuickMovimientoDto } from '@/features/cajas/helpers/quick-movimiento';
import { useQuickMovimientoValues } from '@/features/cajas/hooks/use-quick-movimiento-values';
import { createMovimiento } from '@/features/cajas/services/cajas-api';

const PERSONAS_KEY = 'cajas:quick:personas';

export interface UseQuickMovimientoFormOptions {
  readonly caja: Pick<CajaConSaldo, 'id'>;
  readonly onSuccess: () => void;
}

/** Form del "Nuevo Movimiento" rápido del drawer (caja fija): personas activas + submit. */
export function useQuickMovimientoForm({
  caja,
  onSuccess,
}: UseQuickMovimientoFormOptions) {
  const personas = useAsyncData({
    key: PERSONAS_KEY,
    load: fetchPersonasActivas,
  });
  const options = useMemo(
    () => personaOptions(personas.data ?? []),
    [personas.data],
  );
  const fields = useQuickMovimientoValues();
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const { values } = fields;
    const fieldsOk = fields.validation.validateAll(values);
    const reembolso = personaAReembolsarRequerida(values);
    fields.setReembolsoError(reembolso);
    const dto = buildQuickMovimientoDto(values, caja.id);
    if (!fieldsOk || reembolso || !dto) return;
    setSaving(true);
    try {
      await createMovimiento(dto);
      notify.success(C.QUICK_SUCCESS);
      onSuccess();
    } catch {
      // Paridad: toast propio además del error global de `apiClient`.
      notify.error(C.QUICK_ERROR);
      setSaving(false);
    }
  }

  return {
    ...fields,
    personaOptions: options,
    loadingPersonas: personas.isLoading && !personas.data,
    saving,
    submit,
  };
}

export type QuickMovimientoForm = ReturnType<typeof useQuickMovimientoForm>;
