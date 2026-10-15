'use client';

import { GraduationCap, UserPlus, UserRound } from 'lucide-react';
import { useId } from 'react';

import {
  ActionsMenu,
  ListPanel,
  type ActionLink,
} from '@/shared/components/data';
import { PERSONA_TYPE } from '@/shared/domain';
import { PageHeader } from '@/shared/layout';
import { PERSONAS_COPY as C } from '@/features/personas/constants/copy';
import { PERSONA_ROUTES } from '@/features/personas/constants/personas';
import { usePersonaRowActions } from '@/features/personas/hooks/use-persona-row-actions';
import { usePersonasList } from '@/features/personas/hooks/use-personas-list';
import { PersonasStats } from '@/features/personas/components/list/personas-stats';
import { PersonasTable } from '@/features/personas/components/list/personas-table';
import { PersonasToolbar } from '@/features/personas/components/list/personas-toolbar';

/** Altas independientes de la tab activa: protagonista, educador o persona externa. */
const CREATE_ITEMS: readonly ActionLink[] = [
  {
    tipo: PERSONA_TYPE.PROTAGONISTA,
    label: C.NEW_PROTAGONISTA,
    icon: UserPlus,
  },
  { tipo: PERSONA_TYPE.EDUCADOR, label: C.NEW_EDUCADOR, icon: GraduationCap },
  { tipo: PERSONA_TYPE.EXTERNA, label: C.NEW_EXTERNA, icon: UserRound },
].map(({ tipo, ...item }) => ({
  ...item,
  key: tipo,
  href: PERSONA_ROUTES.create(tipo),
}));

/** `/personas`: stats, tabs por rama/educadores/externos, filtros y tabla con acciones. */
export function PersonasListView() {
  const panelId = useId();
  const list = usePersonasList();
  const actions = usePersonaRowActions(list.setData);
  const resetKey = `${list.tab}|${String(list.showDisabled)}|${JSON.stringify(list.filters)}`;
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title={C.TITLE}
        subtitle={C.SUBTITLE}
        actions={
          <ActionsMenu
            variant="primary"
            label={C.NEW_MEMBER}
            items={CREATE_ITEMS}
            className="flex-1 justify-center md:flex-none"
          />
        }
      />
      <PersonasStats stats={list.stats} />
      <ListPanel
        toolbar={
          <PersonasToolbar
            tab={list.tab}
            onTabChange={list.setTab}
            filters={list.filters}
            onFiltersChange={list.setFilters}
            showDisabled={list.showDisabled}
            onShowDisabledChange={list.setShowDisabled}
            panelId={panelId}
          />
        }
      >
        <PersonasTable
          rows={list.rows}
          docKeys={list.docKeys}
          showDisabled={list.showDisabled}
          actions={actions}
          isLoading={list.isLoading}
          error={list.error}
          resetKey={resetKey}
          panelId={panelId}
        />
      </ListPanel>
    </div>
  );
}
