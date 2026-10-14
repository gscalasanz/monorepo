'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useId } from 'react';

import { ListPanel } from '@/shared/components/data';
import { Button } from '@/shared/components/ui/button';
import { PERSONA_TYPE } from '@/shared/domain';
import { PageHeader } from '@/shared/layout';
import { PERSONAS_COPY as C } from '@/features/personas/constants/copy';
import {
  PERSONA_ROUTES,
  PERSONA_TAB,
  type PersonasTab,
} from '@/features/personas/constants/personas';
import { usePersonaRowActions } from '@/features/personas/hooks/use-persona-row-actions';
import { usePersonasList } from '@/features/personas/hooks/use-personas-list';
import { PersonasStats } from '@/features/personas/components/list/personas-stats';
import { PersonasTable } from '@/features/personas/components/list/personas-table';
import { PersonasToolbar } from '@/features/personas/components/list/personas-toolbar';

/** "Nuevo Miembro" según tab: educador, externa o protagonista (sin preselección de rama). */
function createRouteFor(tab: PersonasTab): string {
  if (tab === PERSONA_TAB.EDUCADORES)
    return PERSONA_ROUTES.create(PERSONA_TYPE.EDUCADOR);
  if (tab === PERSONA_TAB.EXTERNOS)
    return PERSONA_ROUTES.create(PERSONA_TYPE.EXTERNA);
  return PERSONA_ROUTES.create(PERSONA_TYPE.PROTAGONISTA);
}

/** `/personas`: stats, tabs por rama/educadores/externos, filtros y tabla con acciones. */
export function PersonasListView() {
  const router = useRouter();
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
          <Button
            icon={<Plus aria-hidden className="size-4" />}
            onClick={() => router.push(createRouteFor(list.tab))}
          >
            {C.NEW_MEMBER}
          </Button>
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
