'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LAYOUT_COPY } from '@/shared/layout/copy';
import {
  MOBILE_NAV_ITEMS,
  NEW_MOVIMIENTO_HREF,
  isActivePath,
  isFormRoute,
  type NavItem,
} from '@/shared/layout/nav-config';
import { cn } from '@/shared/lib/utils';

const CENTER_SLOT = 2;

function BottomLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-ink-subtle',
        active && 'text-brand',
      )}
    >
      <Icon className="size-5" aria-hidden />
      {item.label}
    </Link>
  );
}

/** Bottom-nav mobile: 4 destinos + "+" central (nuevo movimiento). */
export function MobileBottomNav() {
  const pathname = usePathname();
  if (isFormRoute(pathname)) return null;
  const left = MOBILE_NAV_ITEMS.slice(0, CENTER_SLOT);
  const right = MOBILE_NAV_ITEMS.slice(CENTER_SLOT);
  return (
    <nav
      aria-label={LAYOUT_COPY.MOBILE_NAV_LABEL}
      className="fixed inset-x-0 bottom-0 z-30 flex items-center border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {left.map((item) => (
        <BottomLink key={item.href} item={item} active={isActivePath(pathname, item.href)} />
      ))}
      <div className="flex flex-1 justify-center">
        <Link
          href={NEW_MOVIMIENTO_HREF}
          aria-label={LAYOUT_COPY.NEW_MOVIMIENTO}
          className="flex size-12 items-center justify-center rounded-lg bg-brand text-on-brand shadow-md hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <Plus className="size-6" aria-hidden />
        </Link>
      </div>
      {right.map((item) => (
        <BottomLink key={item.href} item={item} active={isActivePath(pathname, item.href)} />
      ))}
    </nav>
  );
}
