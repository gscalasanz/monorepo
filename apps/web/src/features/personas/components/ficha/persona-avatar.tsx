import { cn } from '@/shared/lib/utils';
import type { Rama } from '@/shared/domain';
import { initialsOf } from '@/features/personas/helpers/persona';

const RAMA_DOT: Readonly<Record<Rama, string>> = {
  Manada: 'bg-rama-manada',
  Unidad: 'bg-rama-unidad',
  Caminantes: 'bg-rama-caminantes',
  Rovers: 'bg-rama-rovers',
};

/** Avatar con iniciales y punto de rama (decorativo: el nombre y la rama van en texto al lado). */
export function PersonaAvatar({
  nombre,
  rama,
}: {
  readonly nombre: string;
  readonly rama: Rama | null;
}) {
  return (
    <span
      aria-hidden
      className="relative grid size-14 shrink-0 place-items-center rounded-full bg-brand-soft text-lg font-semibold text-brand ring-1 ring-border md:size-[60px]"
    >
      {initialsOf(nombre)}
      {rama ? (
        <span
          className={cn(
            'absolute right-0 bottom-0 size-3.5 rounded-full ring-2 ring-surface',
            RAMA_DOT[rama],
          )}
        />
      ) : null}
    </span>
  );
}
