'use client';

import { useState } from 'react';

import { confirmDialog } from '@/shared/confirm';
import type { Evento } from '@/shared/domain';
import { notify } from '@/shared/notifications';
import { EVENTOS_COPY } from '@/features/eventos/constants/copy';
import { EVENTOS_ROUTES } from '@/features/eventos/constants/eventos';
import { productosSinCosto } from '@/features/eventos/helpers/evento-detail';
import type { EventoDetailData } from '@/features/eventos/hooks/use-evento-detail';
import {
  cerrarEvento,
  habilitarMovimientos,
  updateReportePublico,
} from '@/features/eventos/services/eventos-api';

const C = EVENTOS_COPY.detail;

/** URL absoluta del reporte público (para compartir). */
export function reporteUrl(eventoId: string): string {
  return `${window.location.origin}${EVENTOS_ROUTES.reporte(eventoId)}`;
}

interface ActionsParams {
  readonly data: EventoDetailData;
  readonly evento: Evento;
}

/** Visibilidad pública del reporte y copia del link. */
function useReporteActions({ data, evento }: ActionsParams) {
  const [toggling, setToggling] = useState(false);

  const toggleReportePublico = async (): Promise<void> => {
    setToggling(true);
    try {
      const updated = await updateReportePublico({
        id: evento.id,
        reportePublico: !evento.reportePublico,
      });
      data.evento.setData(() => updated);
      notify.success(C.visibilidadOk);
    } catch {
      // El mensaje del backend ya lo muestra el error global.
    } finally {
      setToggling(false);
    }
  };

  const copiarLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(reporteUrl(evento.id));
      notify.success(C.linkCopiado);
    } catch {
      notify.error(C.linkError);
    }
  };

  return { toggling, toggleReportePublico, copiarLink };
}

/** Habilitar movimientos (irreversible) y cerrar el evento. */
function useLifecycleActions({ data, evento }: ActionsParams) {
  const replaceEvento = (next: Evento) => data.evento.setData(() => next);

  const habilitar = async (): Promise<void> => {
    const sinCosto = productosSinCosto(data.productos.data ?? []);
    if (sinCosto.length > 0) {
      notify.error(C.faltanCostos(sinCosto.map((p) => p.nombre).join(', ')));
      return;
    }
    const result = await confirmDialog.run({
      title: C.habilitarTitle,
      message: C.habilitarMessage,
      action: async () => replaceEvento(await habilitarMovimientos(evento.id)),
    });
    if (!result.confirmed) return;
    notify.success(C.habilitarOk);
    await data.refreshVentas();
  };

  const cerrar = async (): Promise<void> => {
    const result = await confirmDialog.run({
      title: C.cerrarTitle,
      message: C.cerrarMessage,
      destructive: true,
      confirmText: C.cerrar,
      action: async () => replaceEvento(await cerrarEvento(evento.id)),
    });
    if (result.confirmed) notify.success(C.cerrarOk);
  };

  return { habilitar, cerrar };
}

/** Acciones del header: visibilidad del reporte, copiar link, habilitar movimientos y cerrar. */
export function useEventoActions(params: ActionsParams) {
  return { ...useReporteActions(params), ...useLifecycleActions(params) };
}
