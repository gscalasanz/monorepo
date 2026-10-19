import { Check } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

export interface DayToggleProps {
  readonly label: string;
  readonly pressed: boolean;
  readonly disabled?: boolean;
  readonly invalid?: boolean;
  readonly onToggle: () => void;
}

const DAY_CLASSES =
  'flex min-h-11 items-center justify-center gap-1.5 rounded-md border border-border-strong bg-surface px-3 text-base text-ink transition-colors outline-none md:min-h-9 md:text-sm ' +
  'hover:bg-recessed focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/25 ' +
  'aria-pressed:border-brand aria-pressed:bg-brand-soft aria-pressed:font-medium aria-pressed:text-brand ' +
  'disabled:cursor-not-allowed disabled:border-border disabled:bg-recessed disabled:text-ink-muted';

/** Botón toggle de un día (`aria-pressed` + check visible, no solo color). */
export function DayToggle(props: DayToggleProps) {
  const { label, pressed, disabled, invalid = false, onToggle } = props;
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onToggle}
      className={cn(DAY_CLASSES, invalid && 'border-danger')}
    >
      {pressed && <Check aria-hidden className="size-4" />}
      {label}
    </button>
  );
}
