import { EventReportView } from '@/features/event-report';

export default async function EventReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EventReportView eventoId={id} />;
}
