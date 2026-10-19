import { notFound } from 'next/navigation';

import { isPlaceholderReport, PlaceholderReportView } from '@/features/reportes';

export default async function PlaceholderReportPage({ params }: { params: Promise<{ report: string }> }) {
  const { report } = await params;
  if (!isPlaceholderReport(report)) notFound();
  return <PlaceholderReportView report={report} />;
}
