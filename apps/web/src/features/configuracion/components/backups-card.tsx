'use client';

import { Database, Sheet } from 'lucide-react';

import { Panel } from '@/shared/components/ui/panel';
import { CONFIG_COPY as C, DOWNLOADS } from '@/features/configuracion/constants/copy';
import { DownloadAction } from '@/features/configuracion/components/download-action';
import { useDownload } from '@/features/configuracion/hooks/use-download';
import { fetchSqlBackup, fetchXlsxExport } from '@/features/configuracion/services/backups-api';

/** Card "Backup y Exportación": Excel (.xlsx) y backup SQL (.sql.gz). */
export function BackupsCard() {
  const xlsx = useDownload({
    fetchBlob: fetchXlsxExport,
    filename: DOWNLOADS.XLSX.fallbackName,
    successMessage: C.XLSX_SUCCESS,
    errorMessage: C.XLSX_ERROR,
  });
  const sql = useDownload({
    fetchBlob: fetchSqlBackup,
    filename: DOWNLOADS.SQL.fallbackName,
    successMessage: C.SQL_SUCCESS,
    errorMessage: C.SQL_ERROR,
  });
  return (
    <Panel title={C.BACKUP_TITLE}>
      <p className="mb-4 text-sm text-ink-muted">{C.BACKUP_DESCRIPTION}</p>
      <div className="grid gap-3 md:grid-cols-2">
        <DownloadAction
          icon={Sheet}
          title={C.XLSX_TITLE}
          subtitle={C.XLSX_SUBTITLE}
          downloading={xlsx.downloading}
          onClick={() => void xlsx.download()}
        />
        <DownloadAction
          icon={Database}
          title={C.SQL_TITLE}
          subtitle={C.SQL_SUBTITLE}
          downloading={sql.downloading}
          onClick={() => void sql.download()}
        />
      </div>
    </Panel>
  );
}
