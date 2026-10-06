'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, type FormEvent } from 'react';

import type { Persona } from '@/shared/domain';
import { useFormState } from '@/shared/forms';
import { useAsyncData } from '@/shared/hooks';
import { notify } from '@/shared/notifications';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import {
  EVENTO_TAB,
  EVENTOS_ROUTES,
} from '@/features/eventos/constants/eventos';
import {
  INITIAL_VENTAS_LOTE_DRAFT,
  buildVentasLoteDto,
  destinoEfectivo,
  esMixto,
  isAgrupacionConDestinoPersonal,
  vendedoresDisponibles,
  type VentasLoteDraft,
} from '@/features/eventos/helpers/ventas-lote';
import { fetchEvento } from '@/features/eventos/services/eventos-api';
import {
  fetchProductos,
  fetchVendedoresElegibles,
  registrarVentasLote,
} from '@/features/eventos/services/ventas-api';

const C = EVENTOS_COPY.lote;

function useLoteData(id: string) {
  const evento = useAsyncData({
    key: `lote:${id}:evento`,
    load: (signal) => fetchEvento(id, signal),
  });
  const productos = useAsyncData({
    key: `lote:${id}:productos`,
    load: (signal) => fetchProductos(id, signal),
  });
  /** Vendedores elegibles (no `/personas`): incluye la agrupación "Grupo Scout". */
  const personas = useAsyncData({
    key: 'personas:vendedores-elegibles',
    load: fetchVendedoresElegibles,
  });
  return { evento, productos, personas };
}

/** Derivados: destino efectivo, vendedores visibles y el aviso de agrupación inválida. */
function useLoteRules(params: {
  readonly data: ReturnType<typeof useLoteData>;
  readonly draft: VentasLoteDraft;
}) {
  const evento = params.data.evento.data;
  const personas = params.data.personas.data;
  const destino = destinoEfectivo({
    evento,
    destinoElegido: params.draft.destinoGanancia,
  });
  const vendedores = useMemo(
    () => vendedoresDisponibles({ personas: personas ?? [], destino }),
    [personas, destino],
  );
  const vendedor: Persona | undefined = personas?.find(
    (p) => p.id === params.draft.vendedorId,
  );
  return {
    mixto: esMixto(evento),
    vendedores,
    agrupacionInvalida: isAgrupacionConDestinoPersonal({ vendedor, destino }),
  };
}

/** Registro de ventas en lote: carga, reglas de destino y envío. */
export function useVentasLote(id: string) {
  const router = useRouter();
  const data = useLoteData(id);
  const form = useFormState<VentasLoteDraft>(INITIAL_VENTAS_LOTE_DRAFT);
  const rules = useLoteRules({ data, draft: form.values });
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const productos = data.productos.data ?? [];
  const backHref = EVENTOS_ROUTES.detail(id, EVENTO_TAB.VENTAS);

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSubmitted(true);
    const dto = buildVentasLoteDto({
      draft: form.values,
      productos,
      mixto: rules.mixto,
    });
    if (!dto || rules.agrupacionInvalida) return;
    setSaving(true);
    try {
      await registrarVentasLote({ eventoId: id, dto });
      notify.success(C.ok);
      router.push(backHref);
    } catch {
      // El mensaje del backend ya lo muestra el error global.
      setSaving(false);
    }
  };

  return {
    data,
    form,
    rules,
    productos,
    saving,
    submitted,
    backHref,
    isLoading: data.evento.isLoading || data.productos.isLoading,
    submit,
  };
}

export type VentasLoteState = ReturnType<typeof useVentasLote>;
