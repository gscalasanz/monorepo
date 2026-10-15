import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { NavChevron } from '@/shared/components/ui/nav-chevron';

export interface PanelProps {
  readonly title: string;
  /** Texto auxiliar junto al título (p. ej. "38 personas"). */
  readonly meta?: ReactNode;
  /** Link de la esquina ("Ver todos"). */
  readonly action?: { readonly label: string; readonly href: string };
  /** Contenido a la derecha del header (botones). Tiene prioridad sobre `action`. */
  readonly headerExtra?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
  /** `flush` = sin padding (listas/tablas a sangre). */
  readonly flush?: boolean;
}

/** Panel de contenido (DESIGN: superficie + hairline + radius-xl + shadow-xs). */
export function Panel({ title, meta, action, headerExtra, children, className, flush }: PanelProps) {
  return (
    <section className={cn('flex min-w-0 flex-col rounded-xl border border-border bg-surface shadow-xs', className)}>
      <header className="flex min-h-[52px] items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-[18px]">
        <h2 className="flex min-w-0 items-baseline gap-2 text-sm font-semibold text-ink">
          <span className="truncate">{title}</span>
          {meta && <span className="text-[13px] font-normal text-ink-subtle">{meta}</span>}
        </h2>
        {headerExtra ??
          (action && (
            <Link
              href={action.href}
              className="group inline-flex min-h-11 shrink-0 items-center gap-0.5 text-[13px] font-medium text-brand hover:underline md:min-h-0"
            >
              {action.label}
              <NavChevron className="size-3.5 text-brand group-hover:text-brand" />
            </Link>
          ))}
      </header>
      <div className={cn('flex-1', !flush && 'p-4 md:p-[18px]')}>{children}</div>
    </section>
  );
}
