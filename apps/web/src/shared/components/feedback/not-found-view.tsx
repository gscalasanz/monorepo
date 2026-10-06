import Link from 'next/link';

import { APP_ROUTES } from '@/shared/constants';
import { cn } from '@/shared/lib/utils';

import { FEEDBACK_COPY } from './copy';

export interface NotFoundViewProps {
  readonly homeHref?: string;
  readonly className?: string;
}

/** Contenido de la página 404 (paridad con `not-found` de Angular). */
export function NotFoundView({
  homeHref = APP_ROUTES.DASHBOARD,
  className,
}: NotFoundViewProps) {
  return (
    <section
      aria-labelledby="not-found-title"
      className={cn('grid justify-items-center gap-3 px-4 py-16 text-center', className)}
    >
      <p className="text-[40px] leading-[44px] font-semibold tracking-[-0.035em] text-ink-subtle tabular-nums">
        {FEEDBACK_COPY.notFoundCode}
      </p>
      <h1 id="not-found-title" className="text-[22px] leading-7 font-semibold text-ink">
        {FEEDBACK_COPY.notFoundTitle}
      </h1>
      <p className="text-sm text-ink-muted">{FEEDBACK_COPY.notFoundHint}</p>
      <Link
        href={homeHref}
        className="mt-2 inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus md:min-h-0"
      >
        {FEEDBACK_COPY.notFoundAction}
      </Link>
    </section>
  );
}
