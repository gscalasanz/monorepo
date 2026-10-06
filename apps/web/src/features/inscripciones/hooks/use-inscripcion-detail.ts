'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { confirmDialog } from '@/shared/confirm';
import type {
  Inscripcion,
  MovimientoInscripcion,
  PagoInscripcionDto,
} from '@/shared/domain';
import { useAsyncData } from '@/shared/hooks';
import { notify } from '@/shared/notifications';
import {
  DETAIL_COPY as C,
  LIST_COPY,
  PAGO_COPY,
} from '@/features/inscripciones/constants/copy';
import { inscripcionRoutes } from '@/features/inscripciones/constants/routes';
import { mergeInscripcion } from '@/features/inscripciones/helpers/detail';
import {
  bonificarInscripcion,
  deleteInscripcion,
  deletePago,
  fetchInscripcion,
  fetchInscripcionOrNull,
  pagarInscripcion,
  quitarBonificacion,
  updatePago,
  type UpdatePagoDto,
} from '@/features/inscripciones/services/inscripciones-api';

export type DetailDialog =
  | { readonly kind: 'bonificar' }
  | { readonly kind: 'pago' }
  | { readonly kind: 'editar-pago'; readonly movimiento: MovimientoInscripcion }
  | null;

/**
 * Mutaciones del detalle: avisan con toast y vuelven a pedir la inscripción
 * (como `reloadDetail` en Angular). No se usa la respuesta de la mutación:
 * `POST /pagar` devuelve el `montoPagado` previo al pago.
 */
function useDetailMutations(params: {
  readonly id: string;
  readonly apply: (next: Inscripcion) => void;
}) {
  const { id, apply } = params;
  const run = useCallback(
    async (action: () => Promise<unknown>, message: string) => {
      await action();
      notify.success(message);
      apply(await fetchInscripcion(id));
    },
    [apply, id],
  );
  return {
    bonificar: (monto: number) =>
      run(() => bonificarInscripcion(id, monto), C.BONIFICADA),
    quitarBonificacion: () =>
      run(() => quitarBonificacion(id), C.BONIFICACION_QUITADA),
    pagar: (dto: PagoInscripcionDto) =>
      run(() => pagarInscripcion(id, dto), PAGO_COPY.REGISTERED),
    editarPago: (movimientoId: string, dto: UpdatePagoDto) =>
      run(
        () => updatePago({ inscripcionId: id, movimientoId }, dto),
        PAGO_COPY.UPDATED,
      ),
    eliminarPago: (movimientoId: string) =>
      run(
        () => deletePago({ inscripcionId: id, movimientoId }),
        PAGO_COPY.DELETED,
      ),
  };
}

/** Detalle de inscripción: carga, diálogos (bonificar / pago / editar pago) y eliminación. */
export function useInscripcionDetail(id: string) {
  const router = useRouter();
  const detail = useAsyncData({
    key: `inscripcion:${id}`,
    load: (signal) => fetchInscripcionOrNull(id, signal),
  });
  const [dialog, setDialog] = useState<DetailDialog>(null);
  const { setData } = detail;
  const apply = useCallback(
    (next: Inscripcion) =>
      setData((prev) => mergeInscripcion(prev ?? undefined, next)),
    [setData],
  );
  const mutations = useDetailMutations({ id, apply });

  const remove = async () => {
    if (!(await confirmDialog.confirmDelete(LIST_COPY.ENTITY))) return;
    try {
      await deleteInscripcion(id);
      notify.success(C.DELETED);
      router.push(inscripcionRoutes.list);
    } catch {
      // El mensaje del backend ya aparece como toast global.
    }
  };

  return { ...detail, dialog, setDialog, mutations, remove };
}

export type InscripcionDetailModel = ReturnType<typeof useInscripcionDetail>;
