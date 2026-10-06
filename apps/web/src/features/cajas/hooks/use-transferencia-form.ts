'use client';

import { useMemo, useState, type FormEvent } from 'react';

import { extractErrorMessage } from '@/shared/api';
import { useSession } from '@/shared/auth';
import { useFieldValidation, useFormState } from '@/shared/forms';
import { useAsyncData } from '@/shared/hooks';
import { fetchCajas } from '@/shared/queries';
import { todayBsAs } from '@/shared/time';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import {
  buildTransferenciaDto,
  destinoOptions,
  transferenciaPrecheck,
  type TransferenciaOrigen,
} from '@/features/cajas/helpers/transferencia';
import {
  transferenciaSchema,
  type TransferenciaFormValues,
} from '@/features/cajas/models/schemas';
import { createTransferencia } from '@/features/cajas/services/cajas-api';

const CAJAS_KEY = 'cajas:transferencia:destinos';

type Values = TransferenciaFormValues;

export interface UseTransferenciaFormOptions {
  readonly origen: TransferenciaOrigen;
  readonly onSuccess: () => void;
}

interface SubmitDeps extends UseTransferenciaFormOptions {
  readonly userId: string | null;
}

/** POST de la transferencia con los chequeos de cliente y el error inline. */
function useTransferenciaSubmit({ origen, onSuccess, userId }: SubmitDeps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(values: Values): Promise<void> {
    const precheck = transferenciaPrecheck({
      userId,
      monto: values.monto ?? 0,
      saldo: origen.saldo,
    });
    const dto = userId
      ? buildTransferenciaDto({
          origenId: origen.id,
          responsableId: userId,
          values,
        })
      : null;
    if (precheck || !dto) {
      setError(precheck);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createTransferencia(dto);
      onSuccess();
    } catch (cause) {
      setSaving(false);
      setError(extractErrorMessage(cause, C.TRANSFER_ERROR));
    }
  }

  return { saving, error, send };
}

/** Form de "Transferir entre Cajas": responsable = usuario logueado, fecha = hoy (BsAs). */
export function useTransferenciaForm({
  origen,
  onSuccess,
}: UseTransferenciaFormOptions) {
  const { user } = useSession();
  const cajas = useAsyncData({ key: CAJAS_KEY, load: fetchCajas });
  const destinos = useMemo(
    () => destinoOptions(cajas.data ?? [], origen.id),
    [cajas.data, origen.id],
  );
  const form = useFormState<Values>({
    cajaDestinoId: null,
    monto: null,
    fecha: todayBsAs(),
    descripcion: '',
  });
  const validation = useFieldValidation(transferenciaSchema);
  const { saving, error, send } = useTransferenciaSubmit({
    origen,
    onSuccess,
    userId: user?.id ?? null,
  });

  return {
    values: form.values,
    validation,
    update: <K extends keyof Values>(name: K, value: Values[K]): void => {
      form.setField(name, value);
      validation.onChange(name, value);
    },
    submit: async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();
      if (validation.validateAll(form.values)) await send(form.values);
    },
    saving,
    destinos,
    loadingCajas: cajas.isLoading && !cajas.data,
    error: error ?? (cajas.error ? C.CAJAS_LOAD_ERROR : null),
    responsableLabel: user?.nombre ?? C.USUARIO_ACTUAL,
  };
}
