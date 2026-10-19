'use client';

import { Moon, Sun } from 'lucide-react';

import { LAYOUT_COPY } from '@/shared/layout/copy';
import { cn } from '@/shared/lib/utils';
import { THEME_MODE, useTheme } from '@/shared/theme';

/** Botón de tema claro/oscuro (port de `ThemeToggleComponent`). */
export function ThemeToggle({ className }: { className?: string }) {
  const { mode, toggle } = useTheme();
  const isDark = mode === THEME_MODE.DARK;
  const label = isDark ? LAYOUT_COPY.THEME_TO_LIGHT : LAYOUT_COPY.THEME_TO_DARK;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-11 items-center justify-center rounded-md transition-colors md:size-9',
        'focus-visible:outline-focus focus-visible:outline-2 focus-visible:outline-offset-2',
        className,
      )}
    >
      {isDark ? <Sun className="size-[18px]" aria-hidden /> : <Moon className="size-[18px]" aria-hidden />}
    </button>
  );
}
