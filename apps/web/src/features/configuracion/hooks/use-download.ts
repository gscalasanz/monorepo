'use client';

import { useState } from 'react';

import { notify } from '@/shared/notifications';
import { downloadBlob } from '@/features/configuracion/helpers/download-blob';

interface DownloadConfig {
  readonly fetchBlob: () => Promise<Blob>;
  readonly filename: string;
  readonly successMessage: string;
  readonly errorMessage: string;
}

/** Descarga con estado: ignora clicks repetidos mientras está en curso. */
export function useDownload(config: DownloadConfig) {
  const [downloading, setDownloading] = useState(false);

  async function download(): Promise<void> {
    if (downloading) return;
    setDownloading(true);
    try {
      downloadBlob(await config.fetchBlob(), config.filename);
      notify.success(config.successMessage);
    } catch {
      notify.error(config.errorMessage);
    } finally {
      setDownloading(false);
    }
  }

  return { downloading, download };
}
