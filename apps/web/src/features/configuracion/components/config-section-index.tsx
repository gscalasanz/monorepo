import {
  CONFIG_COPY as C,
  CONFIG_SECTIONS,
} from '@/features/configuracion/constants/copy';

const anchor = (id: string): string => `#${id}`;

/** Índice lateral fijo (desde `lg`) que lleva a cada sección. */
export function ConfigSectionIndex() {
  return (
    <nav aria-label={C.INDEX_LABEL} className="hidden lg:block">
      <ul className="sticky top-6 flex flex-col gap-0.5 border-l border-border">
        {CONFIG_SECTIONS.map((section) => (
          <li key={section.id}>
            <a
              href={anchor(section.id)}
              className="-ml-px flex min-h-9 items-center border-l-2 border-transparent px-3 text-sm text-ink-muted hover:border-border-strong hover:text-ink focus-visible:outline-2 focus-visible:outline-focus"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
