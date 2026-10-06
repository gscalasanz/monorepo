'use client';

import { useMemo } from 'react';

import { useAsyncData } from '@/shared/hooks';
import {
  fetchPersonasActivas,
  fetchSaldoFondoSolidario,
  fetchSaldoPersonal,
  personaOptions,
} from '@/shared/queries';

const PERSONAS_KEY = 'inscripcion-form:personas';
const FONDO_KEY = 'inscripcion-form:fondo-solidario';

/** Lecturas del form de alta: personas habilitadas, fondo solidario y saldo personal. */
export function useCreateFormData(personaId: string | null) {
  const personas = useAsyncData({
    key: PERSONAS_KEY,
    load: fetchPersonasActivas,
  });
  const fondo = useAsyncData({
    key: FONDO_KEY,
    load: fetchSaldoFondoSolidario,
  });
  const saldo = useAsyncData({
    key: `inscripcion-form:saldo:${personaId ?? ''}`,
    enabled: personaId !== null,
    load: (signal) => fetchSaldoPersonal(personaId ?? '', signal),
  });
  const options = useMemo(
    () => personaOptions(personas.data ?? []),
    [personas.data],
  );
  return {
    personaOptions: options,
    personasLoading: personas.isLoading,
    saldoFondo: fondo.data ?? 0,
    /** Si falla la consulta, el saldo personal queda en 0 (Angular). */
    saldoPersonal: saldo.error ? 0 : (saldo.data ?? 0),
    saldoLoading: saldo.isLoading,
  };
}
