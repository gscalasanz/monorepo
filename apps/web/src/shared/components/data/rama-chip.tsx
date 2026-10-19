import { RAMA_LABELS, type Rama } from '@/shared/domain';
import { cn } from '@/shared/lib/utils';

/** Clases literales por rama (Tailwind necesita strings completos). */
const RAMA_CLASSES: Readonly<Record<Rama, { readonly dot: string; readonly soft: string }>> = {
  Manada: { dot: 'bg-rama-manada', soft: 'bg-rama-manada-soft' },
  Unidad: { dot: 'bg-rama-unidad', soft: 'bg-rama-unidad-soft' },
  Caminantes: { dot: 'bg-rama-caminantes', soft: 'bg-rama-caminantes-soft' },
  Rovers: { dot: 'bg-rama-rovers', soft: 'bg-rama-rovers-soft' },
};

/** Fuera de las 4 ramas (educadores, grupo): punto burgundy sobre hundido. */
const FALLBACK_CLASSES = { dot: 'bg-accent-2', soft: 'bg-recessed' } as const;

function isRama(value: string): value is Rama {
  return Object.hasOwn(RAMA_CLASSES, value);
}

export interface RamaChipProps {
  /** Valor de dominio (`Manada`…) u otro texto (`Educadores`). */
  readonly rama: Rama | string;
  /** `chip` = pill con fondo · `dot` = punto + nombre para listas densas. */
  readonly variant?: 'chip' | 'dot';
  readonly className?: string;
}

/** Chip de rama (DESIGN §Chip de rama): el color siempre acompañado del nombre. */
export function RamaChip({ rama, variant = 'chip', className }: RamaChipProps) {
  const known = isRama(rama);
  const classes = known ? RAMA_CLASSES[rama] : FALLBACK_CLASSES;
  const label = known ? RAMA_LABELS[rama] : rama;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap text-ink',
        variant === 'chip' && ['h-[22px] rounded-pill pr-[9px] pl-[7px]', classes.soft],
        className,
      )}
    >
      <span aria-hidden className={cn('size-[7px] shrink-0 rounded-full', classes.dot)} />
      {label}
    </span>
  );
}
