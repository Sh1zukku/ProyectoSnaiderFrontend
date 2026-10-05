const UNSAFE_FILENAME_CHARS = /[\\/:*?"<>|]/g;

const REVOKE_DELAY_MS = 1000;

export function sanitizeFilename(name: string): string {
  return name.replace(UNSAFE_FILENAME_CHARS, "_");
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = sanitizeFilename(filename);
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS);
}

export function downloadTextFile(
  content: string,
  filename: string,
  mimeType = "text/plain;charset=utf-8",
): void {
  downloadBlob(new Blob([content], { type: mimeType }), filename);
}

export function downloadCsvFile(content: string, filename: string): void {
  downloadTextFile(`\uFEFF${content}`, filename, "text/csv;charset=utf-8");
}

export function filenameFromContentDisposition(header: string | undefined): string | undefined {
  if (!header) return undefined;

  const encoded = header.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (encoded) {
    try {
      return decodeURIComponent(encoded);
    } catch {
      return encoded;
    }
  }

  return header.match(/filename="?([^";]+)"?/i)?.[1];
}

export function todayStamp(date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
