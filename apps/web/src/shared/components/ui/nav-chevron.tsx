import { ChevronRight } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

/**
 * Chevron que indica "esto navega". Decorativo: el nombre accesible lo da el link.
 * Se anima (y se oscurece) cuando el padre tiene la clase `group` y recibe hover.
 */
export function NavChevron({ className }: { readonly className?: string }) {
  return (
    <ChevronRight
      aria-hidden
      className={cn(
        'size-4 shrink-0 text-ink-subtle transition-[color,translate] duration-150 group-hover:translate-x-0.5 group-hover:text-ink',
        className,
      )}
    />
  );
}
