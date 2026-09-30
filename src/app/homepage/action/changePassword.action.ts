import { isAxiosError } from "axios"

import { snaiderApi } from "@/api/snaiderApi"

export interface ChangePasswordResponse {
	message: string
}

const FALLBACK_MESSAGE = "No pudimos actualizar tu contraseña. Intentá de nuevo en un momento."

type ApiErrorBody = {
	detail?: string
	message?: string
	non_field_errors?: string[]
	current_password?: string[]
	new_password?: string[]
}

/**
 * The backend explains *why* a change was rejected; surface that instead of a
 * generic failure so the user knows whether to retype the current password or
 * pick a different new one.
 */
const readApiErrorMessage = (error: unknown): string => {
	if (!isAxiosError<ApiErrorBody>(error)) return FALLBACK_MESSAGE

	const body = error.response?.data
	if (!body) return FALLBACK_MESSAGE

	const reason =
		body.current_password?.[0] ??
		body.new_password?.[0] ??
		body.non_field_errors?.[0] ??
		body.detail ??
		body.message

	return reason || FALLBACK_MESSAGE
}

export const userChangePassword = async (
	actualPassword: string,
	newPassword: string
): Promise<ChangePasswordResponse> => {
	try {
		const { data } = await snaiderApi.post<ChangePasswordResponse>("/client/change-password/", {
			current_password: actualPassword,
			new_password: newPassword
		})
		return data
	} catch (error) {
		throw new Error(readApiErrorMessage(error), { cause: error })
	}
}