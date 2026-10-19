import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

import { LAYOUT_COPY } from '@/shared/layout/copy';
import { cn } from '@/shared/lib/utils';
import { BackLink } from '@/shared/navigation';

interface PageHeaderProps {
  readonly title: string;
  readonly subtitle?: ReactNode;
  /** Acciones a la derecha (un CTA primario por vista). */
  readonly actions?: ReactNode;
  /** Destino de respaldo del "Volver" (arriba del título): normalmente retrocede en el historial. */
  readonly backHref?: string;
  readonly backLabel?: string;
  readonly className?: string;
}

/** Encabezado de página: título 26/32 (22/28 mobile) + subtítulo + acciones. */
export function PageHeader({
  title,
  subtitle,
  actions,
  backHref,
  backLabel,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div className="flex min-w-0 flex-col gap-1">
        {backHref && (
          <BackLink
            fallbackHref={backHref}
            className="mb-1 inline-flex min-h-11 w-fit items-center gap-1.5 text-sm text-ink-muted hover:text-ink md:min-h-0"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {backLabel ?? LAYOUT_COPY.BACK}
          </BackLink>
        )}
        <h1 className="text-[22px] leading-7 font-semibold tracking-[-0.022em] text-ink md:text-[26px] md:leading-8">
          {title}
        </h1>
        {subtitle && <p className="text-[15px] text-ink-muted md:text-sm">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
