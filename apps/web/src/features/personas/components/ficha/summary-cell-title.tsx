import type { LucideIcon } from 'lucide-react';

export interface SummaryCellTitleProps {
  readonly icon: LucideIcon;
  readonly children: string;
}

/** Título chico con ícono de una celda del resumen de dinero. */
export function SummaryCellTitle({
  icon: Icon,
  children,
}: SummaryCellTitleProps) {
  return (
    <h2 className="flex items-center gap-1.5 text-[13px] text-ink-muted">
      <Icon aria-hidden className="size-4 text-ink-subtle" />
      {children}
    </h2>
  );
}
