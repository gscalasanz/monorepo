import { CircleCheck, CircleX } from 'lucide-react';

import { StatusBadge } from '@/shared/components/data';
import { REPORTES_COPY as C } from '@/features/reportes/constants/copy';
import type { DocItem } from '@/features/reportes/helpers/deudas';

/** Documento entregado / faltante: ícono + texto (nunca solo color). */
export function DocChip({ doc }: { readonly doc: DocItem }) {
  return (
    <span>
      <StatusBadge
        tone={doc.ok ? 'success' : 'danger'}
        icon={doc.ok ? CircleCheck : CircleX}
        label={doc.label}
      />
      <span className="sr-only">{doc.ok ? C.DOC_OK : C.DOC_FALTA}</span>
    </span>
  );
}
