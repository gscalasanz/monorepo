/** Badge del año de la inscripción en el encabezado del form. */
export function AnoBadge({ ano }: { readonly ano: number | null }) {
  if (ano === null) return null;
  return (
    <span className="inline-flex h-8 items-center rounded-md bg-brand-soft px-3 text-sm font-semibold text-brand tabular-nums">
      {ano}
    </span>
  );
}
