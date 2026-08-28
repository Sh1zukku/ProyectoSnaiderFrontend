import { snaiderApi } from "@/api/snaiderApi"
import type { UserInfo } from "../interfaces/user.response";


export const getUserAction = async(dni_cuit:string):Promise<UserInfo> => {
    try{
        const {data} = await snaiderApi.get<UserInfo>(`/shipments/search/?dni_cuit=${dni_cuit}`);
        return data;
    }catch(error){
        console.log(error)
        throw error
    }
    
} 