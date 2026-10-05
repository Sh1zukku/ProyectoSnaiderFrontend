import { snaiderApi } from "@/api/snaiderApi";
import { extractApiErrorMessage } from "@/lib/api-error";
import type { UploadShipmentsResponse, UploadShipmentsResult } from "../interface/upload.response";

const FALLBACK_ERROR_MESSAGE = "No se pudieron cargar los datos. Intentá de nuevo.";

export const saveDataAction = async (file: File): Promise<UploadShipmentsResult> => {
	const formData = new FormData();
	formData.append("file", file, file.name);

	try {
		const { data } = await snaiderApi.post<UploadShipmentsResponse>("/admin/upload-txt/", formData);
		const details = data.details;

		return {
			message: data.message,
			created: details?.created ?? 0,
			skippedDuplicates: details?.skipped_duplicates ?? 0,
			errors: details?.errors ?? [],
			newAccounts: details?.new_accounts ?? [],
			credentialsCsv: details?.credentials_csv ?? "",
		};
	} catch (error) {
		throw new Error(extractApiErrorMessage(error, FALLBACK_ERROR_MESSAGE), { cause: error });
	}
};