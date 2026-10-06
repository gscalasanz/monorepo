'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { LAYOUT_COPY } from '@/shared/layout/copy';
import { SidebarContent } from '@/shared/layout/sidebar-content';
import { cn } from '@/shared/lib/utils';

/** Sidebar desktop (≥md): 244px indigo con filo burgundy, colapsable. */
export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const label = collapsed ? LAYOUT_COPY.EXPAND : LAYOUT_COPY.COLLAPSE;
  return (
    <aside
      className={cn(
        'relative sticky top-0 hidden h-dvh shrink-0 border-t-[3px] border-accent-2 bg-sidebar-bg md:block',
        'transition-[width] duration-(--duration-base) ease-(--ease-out)',
        collapsed ? 'w-[72px]' : 'w-[244px]',
      )}
    >
      <SidebarContent collapsed={collapsed} />
      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        aria-label={label}
        aria-expanded={!collapsed}
        title={label}
        className="absolute top-16 -right-3 flex size-6 items-center justify-center rounded-full border border-border bg-surface text-ink-muted shadow-sm hover:text-ink focus-visible:outline-2 focus-visible:outline-focus"
      >
        {collapsed ? <ChevronRight className="size-3.5" aria-hidden /> : <ChevronLeft className="size-3.5" aria-hidden />}
      </button>
    </aside>
  );
}
