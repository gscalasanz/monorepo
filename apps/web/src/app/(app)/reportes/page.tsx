import { redirect } from 'next/navigation';

import { REPORTES_DEFAULT_ROUTE } from '@/features/reportes';

export default function ReportesPage() {
  redirect(REPORTES_DEFAULT_ROUTE);
}
