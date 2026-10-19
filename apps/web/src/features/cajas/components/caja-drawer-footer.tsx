import { ListOrdered, Plus } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { CAJAS_LINKS } from '@/features/cajas/constants/cajas';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { LinkButton } from '@/features/cajas/components/link-button';

export interface CajaDrawerFooterProps {
  readonly cajaId: string;
  readonly onRegistrar: () => void;
}

/** Pie del drawer: "Ver todos" (listado filtrado por caja) y "Registrar" (movimiento rápido). */
export function CajaDrawerFooter({
  cajaId,
  onRegistrar,
}: CajaDrawerFooterProps) {
  return (
    <footer className="flex gap-2 border-t border-border px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] [&>*]:flex-1">
      <LinkButton
        href={CAJAS_LINKS.movimientosDeCaja(cajaId)}
        variant="secondary"
        icon={<ListOrdered aria-hidden />}
      >
        {C.VER_TODOS}
      </LinkButton>
      <Button icon={<Plus aria-hidden />} onClick={onRegistrar}>
        {C.REGISTRAR}
      </Button>
    </footer>
  );
}
