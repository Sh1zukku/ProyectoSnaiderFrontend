import { create } from 'zustand'
import { loginAction } from '../actions/login.action'
import { checkAuthAction } from '../actions/check-auth.action';


type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking';


type AuthState = {
  refresh: string | null,
  token: string | null,
  authStatus: AuthStatus;


  loginAdmin:(username:string, password:string)=> Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;

}

export const useAuthStore = create<AuthState>()((set) => ({
    refresh: null,
    token: null,
    authStatus: 'checking',

    loginAdmin:async(username:string, password:string)=>{
      try{
        const data = await loginAction(username, password)
        const token = data.token ?? data.access
        if (!token) throw new Error('El login no devolvió un token de acceso')
          localStorage.setItem('token', token)
          localStorage.setItem('refresh', data.refresh)
          set({refresh:data.refresh, token, authStatus: 'authenticated'})
          return true
        }catch{
            localStorage.removeItem('token')
            set({refresh:null, token:null})
            return false
        }
    },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    set({ refresh: null, token: null, authStatus: 'not-authenticated' });
  },

    checkAuthStatus: async () => {
    try {
      const { token, refresh } = await checkAuthAction();
      set({
        token: token,
        refresh: refresh,
        authStatus: 'authenticated',
      });
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      set({
        token: undefined,
        refresh: undefined,
        authStatus: 'not-authenticated',
      });

      return false;
    }
    },
}))
