import type { LucideIcon } from 'lucide-react';

export interface ReadonlyInfoProps {
  readonly label: string;
  readonly icon: LucideIcon;
  readonly title: string;
  readonly meta?: string;
}

/** Dato fijo dentro de un form (equivale a `readonly-card` de Angular). */
export function ReadonlyInfo({
  label,
  icon: Icon,
  title,
  meta,
}: ReadonlyInfoProps) {
  return (
    <div className="grid gap-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      <div className="flex items-center gap-3 rounded-lg bg-recessed px-3 py-2.5">
        <Icon className="size-[18px] shrink-0 text-ink-muted" aria-hidden />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">{title}</p>
          {meta && <p className="truncate text-xs text-ink-muted">{meta}</p>}
        </div>
      </div>
    </div>
  );
}
