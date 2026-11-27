'use client';

import { useMemo, useState, type FormEvent } from 'react';

import { extractErrorMessage } from '@/shared/api';
import { useSession } from '@/shared/auth';
import { useFieldValidation, useFormState } from '@/shared/forms';
import { useAsyncData } from '@/shared/hooks';
import { fetchCajas } from '@/shared/queries';
import { todayBsAs } from '@/shared/time';
import { TRANSFERENCIA_COPY as C } from '@/shared/components/transferencia/copy';
import {
  buildTransferenciaDto,
  destinoOptions,
  transferenciaPrecheck,
  type TransferenciaOrigen,
} from '@/shared/components/transferencia/transferencia';
import {
  transferenciaSchema,
  type TransferenciaFormValues,
} from '@/shared/components/transferencia/schema';
import { createTransferencia } from '@/shared/components/transferencia/transferencia-api';

const CAJAS_KEY = 'cajas:transferencia:destinos';

type Values = TransferenciaFormValues;

export interface UseTransferenciaFormOptions {
  readonly origen: TransferenciaOrigen;
  readonly onSuccess: () => void;
  /** Ofrece cuentas personales como destino (default `false`). */
  readonly incluirPersonales?: boolean;
}

interface SubmitDeps {
  readonly origen: TransferenciaOrigen;
  readonly onSuccess: () => void;
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
  incluirPersonales = false,
}: UseTransferenciaFormOptions) {
  const { user } = useSession();
  const cajas = useAsyncData({ key: CAJAS_KEY, load: fetchCajas });
  const destinos = useMemo(
    () =>
      destinoOptions({
        cajas: cajas.data ?? [],
        origenId: origen.id,
        incluirPersonales,
      }),
    [cajas.data, origen.id, incluirPersonales],
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

  const update = <K extends keyof Values>(name: K, value: Values[K]): void => {
    form.setField(name, value);
    validation.onChange(name, value);
  };

  return {
    values: form.values,
    validation,
    update,
    /** Completa el monto con todo el saldo disponible del origen. */
    fillMax: (): void => update('monto', origen.saldo),
    canFillMax: origen.saldo > 0,
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
