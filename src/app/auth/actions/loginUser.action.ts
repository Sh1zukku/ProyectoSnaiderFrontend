import { snaiderApi } from "@/api/snaiderApi"
import { type AuthResponse } from '../interfaces/auth.response';

export const loginUserAction = async(dni_cuit:string, password: string):Promise<AuthResponse> => {
    try{
        const {data} = await snaiderApi.post<AuthResponse>('/auth/client/token/',{
            dni_cuit,
            password
        });
        return data;
    }catch(error){
        console.log(error)
        throw error
    }
    
} 