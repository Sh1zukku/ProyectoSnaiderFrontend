import { snaiderApi } from "@/api/snaiderApi"
import type { Clientes } from "../interface/clientes.response";


export const getAllUserAction = async():Promise<Clientes> => {
    try{
        const {data} = await snaiderApi.get<Clientes>(`/admin/clients/`);
        return data;
    }catch(error){
        console.log(error)
        throw error
    }
    
} 