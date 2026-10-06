'use client';

import { HandHeart, Trees, User, Wallet } from 'lucide-react';

import { SegmentedTabs, type SegmentedTabItem } from '@/shared/components/data';
import { PageHeader } from '@/shared/layout';
import { CAJAS_TAB, type CajasTab } from '@/features/cajas/constants/cajas';
import { CAJAS_COPY as C } from '@/features/cajas/constants/copy';
import { CajaGrupoTab } from '@/features/cajas/components/caja-grupo-tab';
import { CuentasPersonalesTab } from '@/features/cajas/components/cuentas-personales-tab';
import { FondoSolidarioTab } from '@/features/cajas/components/fondo-solidario-tab';
import { FondosRamaTab } from '@/features/cajas/components/fondos-rama-tab';
import { useCajasTab } from '@/features/cajas/hooks/use-cajas-tab';

const ICON_CLASS = 'size-4';

const TABS: readonly SegmentedTabItem<CajasTab>[] = [
  {
    value: CAJAS_TAB.GRUPO,
    label: C.TAB_GRUPO,
    icon: <Wallet className={ICON_CLASS} aria-hidden />,
  },
  {
    value: CAJAS_TAB.RAMA,
    label: C.TAB_RAMA,
    icon: <Trees className={ICON_CLASS} aria-hidden />,
  },
  {
    value: CAJAS_TAB.PERSONAL,
    label: C.TAB_PERSONAL,
    icon: <User className={ICON_CLASS} aria-hidden />,
  },
  {
    value: CAJAS_TAB.FONDO_SOLIDARIO,
    label: C.TAB_FONDO_SOLIDARIO,
    icon: <HandHeart className={ICON_CLASS} aria-hidden />,
  },
];

const panelId = (tab: CajasTab): string => `cajas-panel-${tab}`;
const TAB_LABELS: Readonly<Record<CajasTab, string>> = {
  grupo: C.TAB_GRUPO,
  rama: C.TAB_RAMA,
  personal: C.TAB_PERSONAL,
  'fondo-solidario': C.TAB_FONDO_SOLIDARIO,
};

/** `/cajas`: 4 tabs (cada una recarga al volver). */
export function CajasView() {
  const { tab, setTab } = useCajasTab();

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader title={C.TITLE} subtitle={C.SUBTITLE} />
      <SegmentedTabs
        items={TABS}
        value={tab}
        onValueChange={setTab}
        ariaLabel={C.TABS_LABEL}
        getPanelId={panelId}
        className="self-start"
      />
      <div
        id={panelId(tab)}
        role="tabpanel"
        aria-label={TAB_LABELS[tab]}
        tabIndex={-1}
      >
        {tab === CAJAS_TAB.GRUPO && <CajaGrupoTab />}
        {tab === CAJAS_TAB.RAMA && <FondosRamaTab />}
        {tab === CAJAS_TAB.PERSONAL && <CuentasPersonalesTab />}
        {tab === CAJAS_TAB.FONDO_SOLIDARIO && <FondoSolidarioTab />}
      </div>
    </div>
  );
}
