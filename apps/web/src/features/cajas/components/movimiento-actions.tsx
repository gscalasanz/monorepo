'use client';

import { Eye, Pencil } from 'lucide-react';

import type { Movimiento } from '@/shared/domain';
import { CAJAS_LINKS } from '@/features/cajas/constants/cajas';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { LinkButton } from '@/features/cajas/components/link-button';

/** Acciones de un movimiento en tabla: Ver (y Editar si corresponde). */
export function MovimientoActions({
  movimiento,
  withEdit,
}: {
  readonly movimiento: Movimiento;
  readonly withEdit: boolean;
}) {
  return (
    <div className="flex justify-end gap-1">
      <LinkButton
        href={CAJAS_LINKS.movimiento(movimiento.id)}
        variant="ghost"
        size="sm"
        icon={<Eye aria-hidden />}
      >
        {C.VER}
      </LinkButton>
      {withEdit && (
        <LinkButton
          href={CAJAS_LINKS.movimientoEditar(movimiento.id)}
          variant="ghost"
          size="sm"
          icon={<Pencil aria-hidden />}
        >
          {C.EDITAR}
        </LinkButton>
      )}
    </div>
  );
}
