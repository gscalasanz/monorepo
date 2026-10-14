import { FileText } from 'lucide-react';

import { EmptyState } from '@/shared/components/feedback';
import { Panel } from '@/shared/components/ui/panel';
import { PageHeader } from '@/shared/layout';
import {
  REPORTES_COPY as C,
  PLACEHOLDER_REPORTS,
  type PlaceholderReport,
} from '@/features/reportes/constants/copy';

/** Reportes sin implementar en Angular (solo título + texto): estado vacío dentro de su panel. */
export function PlaceholderReportView({
  report,
}: {
  readonly report: PlaceholderReport;
}) {
  const { title, body } = PLACEHOLDER_REPORTS[report];
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader title={C.TITLE} subtitle={C.SUBTITLE} />
      <Panel title={title}>
        <EmptyState icon={FileText} title={body} />
      </Panel>
    </div>
  );
}
