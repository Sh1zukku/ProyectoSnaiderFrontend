import { snaiderApi } from "@/api/snaiderApi"
import { type AuthResponse } from '../interfaces/auth.response';

export const loginAction = async(username:string, password: string):Promise<AuthResponse> => {
    try{
        const {data} = await snaiderApi.post<AuthResponse>('/auth/token/',{
            username,
            password
        });
        return data;
    }catch(error){
        console.log(error)
        throw error
    }
    
} 