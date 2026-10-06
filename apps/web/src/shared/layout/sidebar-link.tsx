'use client';

import Link from 'next/link';

import type { NavItem } from '@/shared/layout/nav-config';
import { cn } from '@/shared/lib/utils';

interface SidebarLinkProps {
  readonly item: NavItem;
  readonly active: boolean;
  readonly collapsed: boolean;
  readonly onNavigate?: () => void;
}

/** Ítem de la sidebar: activo con `sidebar-hover` + ring blanco 7% (sin barras). */
export function SidebarLink({ item, active, collapsed, onNavigate }: SidebarLinkProps) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      title={collapsed ? item.label : undefined}
      className={cn(
        'flex min-h-11 items-center gap-3 rounded-md px-3 text-[14px] text-sidebar-ink/85 transition-colors md:min-h-9',
        'hover:bg-sidebar-hover hover:text-sidebar-ink',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ink',
        active && 'bg-sidebar-hover font-medium text-sidebar-ink ring-1 ring-sidebar-ink/10',
        collapsed && 'justify-center px-0',
      )}
    >
      <Icon className="size-[18px] shrink-0" aria-hidden />
      {collapsed ? <span className="sr-only">{item.label}</span> : <span className="truncate">{item.label}</span>}
    </Link>
  );
}
