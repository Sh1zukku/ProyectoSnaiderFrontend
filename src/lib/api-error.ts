import { AxiosError } from "axios";

const GENERIC_MESSAGE = "Ocurrió un error inesperado. Intentá de nuevo.";

const flattenDetail = (detail: unknown): string[] => {
  if (typeof detail === "string") return [detail];
  if (Array.isArray(detail)) return detail.flatMap(flattenDetail);
  if (detail && typeof detail === "object") {
    return Object.values(detail as Record<string, unknown>).flatMap(flattenDetail);
  }
  return [];
};

export function extractApiErrorMessage(error: unknown, fallback = GENERIC_MESSAGE): string {
  const data = (error as AxiosError<unknown> | undefined)?.response?.data;

  if (typeof data === "string" && data.trim()) {
    try {
      return extractApiErrorMessage(JSON.parse(data), fallback);
    } catch {
      return data;
    }
  }

  const messages = flattenDetail(data);
  const unique = [...new Set(messages.map((message) => message.trim()).filter(Boolean))];

  return unique.length ? unique.join(" ") : fallback;
}