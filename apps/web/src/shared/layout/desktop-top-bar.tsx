import { ChevronRight } from 'lucide-react';

import { ThemeToggle } from '@/shared/layout/theme-toggle';

/** Barra superior desktop: sección actual + toggle de tema. */
export function DesktopTopBar({ section, subtitle }: { section: string; subtitle: string }) {
  return (
    <header className="hidden h-14 items-center justify-between border-b border-border px-8 md:flex">
      <p className="flex items-center gap-2 text-[13px] text-ink-muted">
        <span>{section}</span>
        <ChevronRight className="size-3.5 text-ink-subtle" aria-hidden />
        <span className="truncate text-ink-subtle">{subtitle}</span>
      </p>
      <ThemeToggle className="text-ink-muted hover:bg-recessed hover:text-ink" />
    </header>
  );
}
