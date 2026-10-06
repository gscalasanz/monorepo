'use client';

import { Menu } from 'lucide-react';
import { useState } from 'react';

import { Sheet, SheetContent, SheetTitle } from '@/shared/components/reui/sheet';
import { LAYOUT_COPY } from '@/shared/layout/copy';
import { SidebarContent } from '@/shared/layout/sidebar-content';
import { ThemeToggle } from '@/shared/layout/theme-toggle';

/** Top bar mobile (<md): indigo 56px con menú (drawer), título y tema. */
export function MobileTopBar({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-1 border-t-[3px] border-accent-2 bg-sidebar-bg px-1 text-sidebar-ink md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={LAYOUT_COPY.OPEN_MENU}
        className="inline-flex size-11 items-center justify-center rounded-md hover:bg-sidebar-hover focus-visible:outline-2 focus-visible:outline-sidebar-ink"
      >
        <Menu className="size-5" aria-hidden />
      </button>
      <span className="flex-1 truncate text-base font-semibold">{title}</span>
      <ThemeToggle className="hover:bg-sidebar-hover" />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[280px] max-w-[85vw] border-none bg-sidebar-bg p-0">
          <SheetTitle className="sr-only">{LAYOUT_COPY.NAV_LABEL}</SheetTitle>
          <SidebarContent collapsed={false} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  );
}
