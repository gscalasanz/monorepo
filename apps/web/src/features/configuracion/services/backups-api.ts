/** Descargas de respaldo (port de `BackupsService`). */
import { API_ENDPOINTS, apiClient } from '@/shared/api';

/** El caller muestra su propio error (sin toast global duplicado). */
export function fetchXlsxExport(): Promise<Blob> {
  return apiClient.getBlob(API_ENDPOINTS.EXPORTS_XLSX, { skipGlobalError: true });
}

export function fetchSqlBackup(): Promise<Blob> {
  return apiClient.getBlob(API_ENDPOINTS.BACKUPS_DOWNLOAD, { skipGlobalError: true });
}
