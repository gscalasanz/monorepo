/**
 * Dispara la descarga de un Blob con un `<a download>` temporal (paridad con
 * `BackupsService`). El nombre es el de fallback: el backend no expone
 * `Content-Disposition` por CORS, así que Angular también terminaba usándolo.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  if (blob.size === 0) throw new Error('Archivo vacío');
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
