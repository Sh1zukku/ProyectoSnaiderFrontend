import { snaiderApi } from "@/api/snaiderApi";

interface PasswordFile {
  blob: Blob;
  filename: string;
}

export const regenerateClientPasswordAction = async (clientId: number): Promise<PasswordFile> => {
  const response = await snaiderApi.post<Blob>(
    `/admin/clients/${clientId}/regenerate-password/`,
    undefined,
    { responseType: "blob" },
  );
  const disposition = response.headers["content-disposition"] as string | undefined;
  const encodedFilename = disposition?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  const basicFilename = disposition?.match(/filename="?([^";]+)"?/i)?.[1];
  let filename = basicFilename;
  if (encodedFilename) {
    try {
      filename = decodeURIComponent(encodedFilename);
    } catch {
      filename = encodedFilename;
    }
  }

  if (!filename) filename = `restablecimiento-contrasena-${clientId}.txt`;

  return {
    blob: response.data,
    filename: filename.replace(/[\\/:*?"<>|]/g, "_"),
  };
};