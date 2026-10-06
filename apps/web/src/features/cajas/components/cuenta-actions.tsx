'use client';

import { Plus, ReceiptText } from 'lucide-react';

import { CAJAS_LINKS } from '@/features/cajas/constants/cajas';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { LinkButton } from '@/features/cajas/components/link-button';
import type { CuentaRow } from '@/features/cajas/helpers/cuentas';

/** Acciones de una cuenta: ver sus movimientos o registrar uno. */
export function CuentaActions({ row }: { readonly row: CuentaRow }) {
  return (
    <div className="flex justify-end gap-1">
      <LinkButton
        href={CAJAS_LINKS.movimientosDeCaja(row.id)}
        variant="ghost"
        size="sm"
        stopPropagation
        title={C.VER_MOVIMIENTOS}
        icon={<ReceiptText aria-hidden />}
      >
        {C.MOVIMIENTOS}
      </LinkButton>
      <LinkButton
        href={CAJAS_LINKS.movimientoNuevo(row.id)}
        variant="ghost"
        size="sm"
        stopPropagation
        icon={<Plus aria-hidden />}
      >
        {C.REGISTRAR}
      </LinkButton>
    </div>
  );
}
