'use client';

import { ArrowLeftRight, Info, Plus } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { CAJAS_LINKS } from '@/features/cajas/constants/cajas';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { LinkButton } from '@/features/cajas/components/link-button';

export interface CajaGrupoActionsProps {
  readonly cajaId: string;
  readonly onTransferir: () => void;
  readonly onVerDetalles: () => void;
}

/** Acciones de la caja de grupo: registrar, transferir a rama y detalles («ver todos» es el link del panel). */
export function CajaGrupoActions({
  cajaId,
  onTransferir,
  onVerDetalles,
}: CajaGrupoActionsProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex lg:flex-wrap lg:justify-end">
      <LinkButton
        href={CAJAS_LINKS.movimientoNuevo(cajaId)}
        icon={<Plus aria-hidden />}
      >
        {C.REGISTRAR_MOVIMIENTO}
      </LinkButton>
      <Button
        variant="secondary"
        icon={<ArrowLeftRight aria-hidden />}
        onClick={onTransferir}
      >
        {C.TRANSFERIR_A_RAMA}
      </Button>
      <Button
        variant="secondary"
        icon={<Info aria-hidden />}
        onClick={onVerDetalles}
      >
        {C.VER_DETALLES}
      </Button>
    </div>
  );
}
