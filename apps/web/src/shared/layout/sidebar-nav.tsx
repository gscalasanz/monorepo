'use client';

import { usePathname } from 'next/navigation';

import { LAYOUT_COPY } from '@/shared/layout/copy';
import { NAV_GROUPS, isActivePath } from '@/shared/layout/nav-config';
import { SidebarLink } from '@/shared/layout/sidebar-link';

interface SidebarNavProps {
  readonly collapsed: boolean;
  readonly onNavigate?: () => void;
}

/** Grupos de navegación de la sidebar. */
export function SidebarNav({ collapsed, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  return (
    <nav aria-label={LAYOUT_COPY.NAV_LABEL} className="flex flex-1 flex-col gap-5 overflow-y-auto">
      {NAV_GROUPS.map((group) => (
        <div key={group.title ?? 'main'} className="flex flex-col gap-0.5">
          {group.title && !collapsed && (
            <p className="px-3 pb-1 text-xs font-medium text-sidebar-ink/65">{group.title}</p>
          )}
          {group.items.map((item) => (
            <SidebarLink
              key={item.href}
              item={item}
              collapsed={collapsed}
              active={isActivePath(pathname, item.href)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ))}
    </nav>
  );
}
