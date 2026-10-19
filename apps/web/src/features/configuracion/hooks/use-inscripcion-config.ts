'use client';

import { useEffect, useState } from 'react';

import { notify } from '@/shared/notifications';
import { loadInscripcionConfig, updateInscripcionConfig } from '@/shared/settings';
import { CONFIG_COPY as C } from '@/features/configuracion/constants/copy';

interface Montos {
  readonly montoScoutArgentina: number | null;
  readonly montoGrupo: number | null;
}

const isValidMonto = (value: number | null): value is number => value !== null && value >= 0;

/** Montos de inscripción en localStorage (`scout_inscripcion_config`). */
export function useInscripcionConfig() {
  const [montos, setMontos] = useState<Montos>({ montoScoutArgentina: 0, montoGrupo: 0 });

  useEffect(() => {
    // localStorage solo existe en el cliente: se lee después de montar.
    const stored = loadInscripcionConfig();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza con un sistema externo (storage)
    setMontos(stored);
  }, []);

  function setMonto(key: keyof Montos, value: number | null): void {
    setMontos((prev) => ({ ...prev, [key]: value }));
  }

  function save(): void {
    const { montoScoutArgentina, montoGrupo } = montos;
    if (!isValidMonto(montoScoutArgentina) || !isValidMonto(montoGrupo)) {
      notify.error(C.INVALID);
      return;
    }
    updateInscripcionConfig({ montoScoutArgentina, montoGrupo });
    notify.success(C.SAVED);
  }

  return { montos, setMonto, save };
}
