'use client';

import { Button } from '@/shared/components/ui/button';
import { MoneyField } from '@/shared/components/ui/form';
import { Panel } from '@/shared/components/ui/panel';
import { CONFIG_COPY as C } from '@/features/configuracion/constants/copy';
import { useInscripcionConfig } from '@/features/configuracion/hooks/use-inscripcion-config';

const negativeError = (value: number | null): string | undefined =>
  value !== null && value < 0 ? C.MIN_ZERO : undefined;

/** Card "Configuración de Inscripciones": montos guardados en el navegador. */
export function InscripcionConfigCard() {
  const { montos, setMonto, save } = useInscripcionConfig();
  return (
    <Panel title={C.INSCRIPCIONES_TITLE}>
      <div className="grid gap-4 md:grid-cols-2">
        <MoneyField
          label={C.MONTO_SA}
          size="md"
          value={montos.montoScoutArgentina}
          error={negativeError(montos.montoScoutArgentina)}
          onChange={(value) => setMonto('montoScoutArgentina', value)}
        />
        <MoneyField
          label={C.MONTO_GRUPO}
          size="md"
          value={montos.montoGrupo}
          error={negativeError(montos.montoGrupo)}
          onChange={(value) => setMonto('montoGrupo', value)}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button className="w-full sm:w-44" onClick={save}>
          {C.SAVE}
        </Button>
      </div>
    </Panel>
  );
}
