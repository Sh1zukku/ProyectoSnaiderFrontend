import { snaiderApi } from "@/api/snaiderApi"
import type { Shipments } from "../interface/shipments.response";



export const getShipmentAction = async():Promise<Shipments> => {
    try{
        const {data} = await snaiderApi.get<Shipments>(`/admin/shipments/`);
        return data;
    }catch(error){
        console.log(error)
        throw error
    }
    
} 