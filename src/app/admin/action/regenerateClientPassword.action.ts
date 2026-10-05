import { snaiderApi } from "@/api/snaiderApi";
import { extractApiErrorMessage } from "@/lib/api-error";
import { todayStamp } from "@/lib/download";
import type {
  PasswordFile,
  RegeneratedPasswordResponse,
} from "../interface/upload.response";

const FALLBACK_ERROR_MESSAGE = "No se pudo restablecer la contraseña.";

export const regenerateClientPasswordAction = async (clientId: number): Promise<PasswordFile> => {
  let data: RegeneratedPasswordResponse;

  try {
    ({ data } = await snaiderApi.post<RegeneratedPasswordResponse>(
      `/admin/clients/${clientId}/regenerate-password/`,
    ));
  } catch (error) {
    throw new Error(extractApiErrorMessage(error, FALLBACK_ERROR_MESSAGE), { cause: error });
  }

  const content = [
    `DNI/CUIT: ${data.dni_cuit ?? ""}`,
    `Nombre: ${data.name ?? ""}`,
    `Contraseña: ${data.password ?? ""}`,
    "",
  ].join("\n");

  return {
    content,
    filename: `restablecimiento-contrasena-${todayStamp()}.txt`,
  };
};