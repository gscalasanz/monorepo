interface RamaBreakdownProps {
  readonly items: readonly { readonly label: string; readonly count: number }[];
}

/** Desglose "Rama: n" de una categoría de deudores (nada si está vacío). */
export function RamaBreakdown({ items }: RamaBreakdownProps) {
  if (items.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-muted">
      {items.map((item) => (
        <li key={item.label}>{`${item.label}: ${item.count}`}</li>
      ))}
    </ul>
  );
}
