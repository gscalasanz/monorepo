'use client';

import {
  FilterBar,
  SegmentedTabs,
  type FilterField,
  type FilterValues,
} from '@/shared/components/data';
import { SwitchField } from '@/shared/components/ui/form';
import { RAMA_LABELS, RAMA_TAB_KEYS, RAMAS } from '@/shared/domain';
import { PERSONAS_COPY as C } from '@/features/personas/constants/copy';
import {
  PERSONA_TAB,
  SEARCH_FILTER_KEY,
  type PersonasTab,
} from '@/features/personas/constants/personas';

const TAB_ITEMS: readonly {
  readonly value: PersonasTab;
  readonly label: string;
}[] = [
  ...RAMAS.map((rama) => ({
    value: RAMA_TAB_KEYS[rama],
    label: RAMA_LABELS[rama],
  })),
  { value: PERSONA_TAB.EDUCADORES, label: C.TAB_EDUCADORES },
  { value: PERSONA_TAB.EXTERNOS, label: C.TAB_EXTERNOS },
];

const FILTER_FIELDS: readonly FilterField[] = [
  {
    key: SEARCH_FILTER_KEY,
    type: 'search',
    label: C.SEARCH_LABEL,
    placeholder: C.SEARCH_PLACEHOLDER,
  },
];

export interface PersonasToolbarProps {
  readonly tab: PersonasTab;
  readonly onTabChange: (tab: PersonasTab) => void;
  readonly filters: FilterValues;
  readonly onFiltersChange: (next: FilterValues) => void;
  readonly showDisabled: boolean;
  readonly onShowDisabledChange: (value: boolean) => void;
  readonly panelId: string;
}

/** Tabs por rama/educadores/externos + búsqueda + "Mostrar deshabilitados". */
export function PersonasToolbar(props: PersonasToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-4 py-3 md:px-[18px]">
      <SegmentedTabs<PersonasTab>
        ariaLabel={C.TABS_LABEL}
        items={TAB_ITEMS}
        value={props.tab}
        onValueChange={props.onTabChange}
        getPanelId={() => props.panelId}
        className="self-start"
      />
      <FilterBar
        fields={FILTER_FIELDS}
        value={props.filters}
        onChange={props.onFiltersChange}
        trailing={
          <SwitchField
            label={C.SHOW_DISABLED}
            value={props.showDisabled}
            onChange={props.onShowDisabledChange}
            className="whitespace-nowrap"
          />
        }
      />
    </div>
  );
}
