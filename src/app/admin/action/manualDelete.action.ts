import { snaiderApi } from "@/api/snaiderApi"
import type { ManualDeleteResponse } from "../interface/shipments.response";

export const manualDelete = async (days: number): Promise<ManualDeleteResponse> => {
    try {
        const { data } = await snaiderApi.post<ManualDeleteResponse>("/admin/shipments/delete-old/", {
            days
        })
        return data
    } catch (error) {
        throw new Error('No se pudieron eliminar los envíos antiguos.', { cause: error });
    }
}
