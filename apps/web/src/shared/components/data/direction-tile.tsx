import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

import { DATA_COPY } from '@/shared/components/data/copy';

export interface DirectionTileProps {
  readonly direction: 'in' | 'out';
  /** Si es `true`, el tile es decorativo (el texto vecino ya dice la dirección). */
  readonly decorative?: boolean;
  readonly className?: string;
}

/** Tile 28px con flecha: verde si entra, neutro si sale (DESIGN §Tabla densa). */
export function DirectionTile({ direction, decorative = false, className }: DirectionTileProps) {
  const Icon = direction === 'in' ? ArrowDownLeft : ArrowUpRight;
  return (
    <span
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : DATA_COPY.direction[direction]}
      data-direction={direction}
      className={cn(
        'grid size-7 shrink-0 place-items-center rounded-md ring-1 ring-inset',
        direction === 'in'
          ? 'bg-success-soft text-money-in ring-money-in/20'
          : 'bg-recessed text-ink-muted ring-border',
        className,
      )}
    >
      <Icon aria-hidden className="size-[15px]" strokeWidth={2} />
    </span>
  );
}
