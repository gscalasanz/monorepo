import { Check, Minus } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

export interface DocCheckProps {
  readonly delivered: boolean;
  /** Texto accesible ("Entregado" / "Pendiente"). */
  readonly label: string;
}

/** Celda booleana de documentación: ícono + texto oculto (nunca solo color). */
export function DocCheck({ delivered, label }: DocCheckProps) {
  const Icon = delivered ? Check : Minus;
  return (
    <span
      className={cn(
        'inline-grid size-6 place-items-center rounded-sm',
        delivered ? 'bg-success-soft text-success' : 'text-ink-subtle',
      )}
    >
      <Icon aria-hidden className="size-3.5" strokeWidth={2.25} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
