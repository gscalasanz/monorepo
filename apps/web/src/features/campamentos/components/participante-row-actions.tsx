'use client';

import {
  ClipboardCheck,
  ClipboardX,
  Gift,
  Plus,
  UserMinus,
  XCircle,
} from 'lucide-react';

import { RowActionsMenu, type RowAction } from '@/shared/components/data';
import type { ParticipantePago } from '@/shared/domain';
import { PARTICIPANTES_COPY as C } from '@/features/campamentos/constants/copy';
import { participanteAcciones } from '@/features/campamentos/helpers/detalle';
import type { DetalleActions } from '@/features/campamentos/hooks/use-detalle-actions';

export interface ParticipanteHandlers {
  readonly actions: DetalleActions;
  readonly onRegistrarPago: (p: ParticipantePago) => void;
  readonly onBonificar: (p: ParticipantePago) => void;
}

interface MenuParams {
  readonly participante: ParticipantePago;
  readonly handlers: ParticipanteHandlers;
}

/** Pago y bonificación (paridad con los `@if` de la card de Angular). */
function plataActions({
  participante: p,
  handlers,
}: MenuParams): readonly RowAction[] {
  const can = participanteAcciones(p);
  const pago: RowAction = {
    key: 'pago',
    label: C.REGISTRAR_PAGO,
    icon: Plus,
    onSelect: () => handlers.onRegistrarPago(p),
  };
  const bonificar: RowAction = {
    key: 'bonificar',
    label: can.ajustar ? C.AJUSTAR_BONIFICACION : C.BONIFICAR,
    icon: Gift,
    onSelect: () => handlers.onBonificar(p),
  };
  const quitar: RowAction = {
    key: 'quitar-bonificacion',
    label: C.QUITAR_BONIFICACION,
    icon: XCircle,
    onSelect: () => void handlers.actions.quitarBonificacion(p),
  };
  return [
    ...(can.registrarPago ? [pago] : []),
    ...(can.bonificar ? [bonificar] : []),
    ...(can.quitarBonificacion ? [quitar] : []),
  ];
}

export function participanteMenu(params: MenuParams): readonly RowAction[] {
  const { participante: p, handlers } = params;
  return [
    ...plataActions(params),
    {
      key: 'autorizacion',
      label: p.autorizacionEntregada ? C.MARCAR_PENDIENTE : C.MARCAR_ENTREGADA,
      icon: p.autorizacionEntregada ? ClipboardX : ClipboardCheck,
      onSelect: () => void handlers.actions.toggleAutorizacion(p),
    },
    {
      key: 'quitar',
      label: C.QUITAR,
      icon: UserMinus,
      destructive: true,
      onSelect: () => void handlers.actions.removeParticipante(p),
    },
  ];
}

/** ⋯ de la fila del participante. */
export function ParticipanteRowActions(props: MenuParams) {
  return (
    <RowActionsMenu
      ariaLabel={C.acciones(props.participante.nombre)}
      actions={participanteMenu(props)}
    />
  );
}
