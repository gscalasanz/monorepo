'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { AppSidebar } from '@/shared/layout/app-sidebar';
import { LAYOUT_COPY } from '@/shared/layout/copy';
import { MobileBottomNav } from '@/shared/layout/mobile-bottom-nav';
import { MobileTopBar } from '@/shared/layout/mobile-top-bar';
import { pageMetaFor } from '@/shared/layout/nav-config';

/**
 * Shell autenticado: sidebar (desktop) / top bar + bottom-nav (mobile). El contenido ocupa todo
 * el ancho (los formularios se acotan solos) y cada página es dueña de su título y subtítulo:
 * en desktop no hay barra superior que los repita.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const meta = pageMetaFor(pathname);
  const title = meta?.title ?? LAYOUT_COPY.APP_NAME;
  return (
    <div className="flex min-h-dvh bg-canvas">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar title={title} />
        <main id="main" className="w-full flex-1 px-4 pt-5 pb-28 md:px-8 md:pt-8 md:pb-12">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
