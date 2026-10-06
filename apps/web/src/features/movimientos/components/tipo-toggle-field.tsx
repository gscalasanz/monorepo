'use client';

import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

import { SegmentedTabs, type SegmentedTabItem } from '@/shared/components/data';
import { FieldLabelText } from '@/shared/components/ui/form';
import { TIPO_MOVIMIENTO, type TipoMovimiento } from '@/shared/domain';
import { MOVIMIENTOS_COPY as C } from '@/features/movimientos/constants/copy';
import { TIPO_OPTIONS } from '@/features/movimientos/helpers/form-options';

const ICONS = {
  [TIPO_MOVIMIENTO.INGRESO]: <ArrowDownLeft className="size-4" aria-hidden />,
  [TIPO_MOVIMIENTO.EGRESO]: <ArrowUpRight className="size-4" aria-hidden />,
} as const;

const ITEMS: readonly SegmentedTabItem<TipoMovimiento>[] = TIPO_OPTIONS.map(
  (option) => ({
    value: option.value,
    label: option.label,
    icon: ICONS[option.value],
  }),
);

interface TipoToggleFieldProps {
  readonly value: TipoMovimiento;
  readonly onChange: (value: TipoMovimiento) => void;
}

/** Tipo Ingreso / Egreso como control segmentado (DESIGN §Formularios). */
export function TipoToggleField({ value, onChange }: TipoToggleFieldProps) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-[13px] font-medium text-ink">
        <FieldLabelText label={C.TIPO} required />
      </legend>
      <SegmentedTabs
        items={ITEMS}
        value={value}
        onValueChange={onChange}
        ariaLabel={C.TIPO}
        semantics="toggle"
        className="w-full [&>*]:flex-1 [&>*]:justify-center"
      />
    </fieldset>
  );
}
