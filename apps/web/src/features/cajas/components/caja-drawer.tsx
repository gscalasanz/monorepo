'use client';

import { Sheet, SheetContent } from '@/shared/components/reui/sheet';
import type { CajaConSaldo } from '@/shared/domain';
import { CajaDrawerBody } from '@/features/cajas/components/caja-drawer-body';

export interface CajaDrawerProps {
  /** Caja abierta (`null` = drawer cerrado). */
  readonly caja: CajaConSaldo | null;
  readonly onClose: () => void;
}

/** Drawer lateral con los movimientos de una caja y el registro rápido. */
export function CajaDrawer({ caja, onClose }: CajaDrawerProps) {
  return (
    <Sheet open={caja !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full gap-0 bg-surface p-0 text-ink data-[side=right]:w-full data-[side=right]:sm:max-w-md"
      >
        {caja && <CajaDrawerBody caja={caja} onClose={onClose} />}
      </SheetContent>
    </Sheet>
  );
}
