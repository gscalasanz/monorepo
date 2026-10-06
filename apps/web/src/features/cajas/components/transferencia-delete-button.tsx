import { Trash2 } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';

/** Botón "Eliminar" de una transferencia recibida (abre la confirmación). */
export function TransferenciaDeleteButton({
  onClick,
}: {
  readonly onClick: () => void;
}) {
  return (
    <div className="flex justify-end">
      <Button
        variant="ghost"
        size="sm"
        className="text-danger hover:text-danger"
        title={C.ELIMINAR_TRANSFERENCIA}
        icon={<Trash2 aria-hidden />}
        onClick={onClick}
      >
        {C.ELIMINAR}
      </Button>
    </div>
  );
}
