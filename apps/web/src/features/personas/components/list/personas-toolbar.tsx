'use client';

import {
  FilterBar,
  ListToolbar,
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

/** Una línea: tabs por rama/educadores/externos + búsqueda + "Mostrar deshabilitados" (se parte en mobile). */
export function PersonasToolbar(props: PersonasToolbarProps) {
  return (
    <ListToolbar>
      <SegmentedTabs<PersonasTab>
        ariaLabel={C.TABS_LABEL}
        items={TAB_ITEMS}
        value={props.tab}
        onValueChange={props.onTabChange}
        getPanelId={() => props.panelId}
      />
      <FilterBar
        fields={FILTER_FIELDS}
        value={props.filters}
        onChange={props.onFiltersChange}
        className="min-w-0 flex-1"
        trailing={
          <SwitchField
            label={C.SHOW_DISABLED}
            value={props.showDisabled}
            onChange={props.onShowDisabledChange}
            className="whitespace-nowrap"
          />
        }
      />
    </ListToolbar>
  );
}
