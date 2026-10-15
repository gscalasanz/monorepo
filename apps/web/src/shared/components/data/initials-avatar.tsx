import { initialsOf } from '@/shared/format';
import { cn } from '@/shared/lib/utils';

const SIZE_CLASSES = {
  /** Listas densas (deudores): 32px sobre fondo hundido. */
  sm: 'size-8 bg-recessed text-xs font-medium text-ink-muted',
  /** Cabeceras (ficha de persona): 56px tono de marca. */
  lg: 'size-14 bg-brand-soft text-lg font-semibold text-brand',
} as const;

export interface InitialsAvatarProps {
  readonly name: string;
  readonly size?: keyof typeof SIZE_CLASSES;
  readonly className?: string;
}

/** Avatar con iniciales. Decorativo: el nombre siempre va en texto al lado. */
export function InitialsAvatar({ name, size = 'sm', className }: InitialsAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center rounded-full ring-1 ring-border',
        SIZE_CLASSES[size],
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
