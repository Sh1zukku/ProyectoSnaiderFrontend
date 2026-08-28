import { snaiderApi } from "@/api/snaiderApi"
import type { AuthResponse } from '../interfaces/auth.response';

export const checkAuthAction = async (): Promise<AuthResponse> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  const refresh = localStorage.getItem('refresh')
  try {
    const { data } = await snaiderApi.post<AuthResponse>('/auth/token/refresh/',{
      refresh
    });

    const token = data.token ?? data.access;
    if (!token) throw new Error('La renovación no devolvió un token de acceso');
    localStorage.setItem('token', token);
    if (data.refresh) localStorage.setItem('refresh', data.refresh);

    return { ...data, token };
  } catch (error) {
    console.log(error);
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    throw new Error('Token expired or not valid');
  }
};