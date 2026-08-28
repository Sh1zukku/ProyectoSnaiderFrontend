import { snaiderApi } from "@/api/snaiderApi"


export const saveDataAction = async (file: File) => {
	const formData = new FormData()
	formData.append("file", file, file.name)
    try {
        return await snaiderApi.post("/admin/upload-txt/", formData)
    } catch (error) {
        throw new Error('No se pudo cargar correctamente los datos');
    }
}