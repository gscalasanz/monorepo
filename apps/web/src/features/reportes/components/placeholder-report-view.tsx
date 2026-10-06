import { FileText } from 'lucide-react';

import { EmptyState } from '@/shared/components/feedback';
import { PageHeader } from '@/shared/layout';
import { REPORTES_COPY as C, PLACEHOLDER_REPORTS, type PlaceholderReport } from '@/features/reportes/constants/copy';

/** Reportes sin implementar en Angular (solo título + texto): se replican igual. */
export function PlaceholderReportView({ report }: { readonly report: PlaceholderReport }) {
  const { title, body } = PLACEHOLDER_REPORTS[report];
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader title={C.TITLE} subtitle={C.SUBTITLE} />
      <EmptyState icon={FileText} title={title} hint={body} />
    </div>
  );
}
