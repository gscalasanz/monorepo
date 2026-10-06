'use client';

import { usePathname } from 'next/navigation';

import { NAV_FOOTER_ITEM, isActivePath } from '@/shared/layout/nav-config';
import { SidebarBrand } from '@/shared/layout/sidebar-brand';
import { SidebarLink } from '@/shared/layout/sidebar-link';
import { SidebarNav } from '@/shared/layout/sidebar-nav';
import { SidebarUser } from '@/shared/layout/sidebar-user';

interface SidebarContentProps {
  readonly collapsed: boolean;
  readonly onNavigate?: () => void;
}

/** Contenido de la sidebar (compartido por la versión desktop y el drawer mobile). */
export function SidebarContent({ collapsed, onNavigate }: SidebarContentProps) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col gap-6 px-3 pt-5 pb-4">
      <SidebarBrand collapsed={collapsed} />
      <SidebarNav collapsed={collapsed} onNavigate={onNavigate} />
      <div className="flex flex-col gap-3 border-t border-sidebar-ink/15 pt-3">
        <SidebarLink
          item={NAV_FOOTER_ITEM}
          collapsed={collapsed}
          active={isActivePath(pathname, NAV_FOOTER_ITEM.href)}
          onNavigate={onNavigate}
        />
        <SidebarUser collapsed={collapsed} />
      </div>
    </div>
  );
}
