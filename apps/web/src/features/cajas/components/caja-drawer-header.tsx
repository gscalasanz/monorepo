import { X } from 'lucide-react';

import { Money } from '@/shared/components/data';
import { SheetDescription, SheetTitle } from '@/shared/components/reui/sheet';
import { Button } from '@/shared/components/ui/button';
import type { CajaConSaldo } from '@/shared/domain';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';

export interface CajaDrawerHeaderProps {
  readonly caja: CajaConSaldo;
  readonly onClose: () => void;
}

/** Header del drawer: nombre de la caja, saldo y cerrar. */
export function CajaDrawerHeader({ caja, onClose }: CajaDrawerHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-4">
      <div className="min-w-0">
        <SheetTitle className="truncate text-base font-semibold text-ink">
          {caja.nombre ?? C.DRAWER_DEFAULT_NAME}
        </SheetTitle>
        <SheetDescription render={<div />} className="mt-1 text-ink">
          <Money
            amount={caja.saldoActual}
            size="figure-md"
            tone={caja.saldoActual < 0 ? 'debt' : undefined}
          />
        </SheetDescription>
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label={C.CLOSE_DRAWER}
        onClick={onClose}
      >
        <X aria-hidden />
      </Button>
    </header>
  );
}
