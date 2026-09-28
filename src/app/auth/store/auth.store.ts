import { create } from 'zustand'
import { checkAuthAction } from '../actions/check-auth.action';
import { loginAdminAction } from '../actions/loginAdmin.action';
import { loginUserAction } from '../actions/loginUser.action';


type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking';
type UserType = 'admin' | 'user';


type AuthState = {
  refresh: string | null,
  token: string | null,
  authStatus: AuthStatus;
  usertype: UserType | null;
  userId: string | null;

  isAdmin: () => boolean;

  loginAdmin:(username:string, password:string)=> Promise<boolean>;
  loginUser:(username:string, password:string)=> Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()((set) => ({
    refresh: null,
    token: null,
    authStatus: 'checking',
    usertype: null,
    userId: null,

    isAdmin: (): boolean => {
      const type = useAuthStore.getState().usertype;
      return type === 'admin';
      // return !!get().user?.roles.includes('admin')
    },

    loginAdmin:async(username:string, password:string)=>{
      try{
        const data = await loginAdminAction(username, password)
        const token = data.token ?? data.access
        if (!token) throw new Error('El login no devolvió un token de acceso')
          localStorage.setItem('token', token)
          localStorage.setItem('refresh', data.refresh)
          localStorage.setItem('type', 'admin')
          localStorage.removeItem('userId')
          set({refresh:data.refresh, token, authStatus: 'authenticated', usertype: 'admin', userId: null})
          return true
        }catch{
            localStorage.removeItem('token')
            set({refresh:null, token:null})
            return false
        }
    },

    loginUser:async(dni_cuit:string, password:string)=>{
      try{
        const data = await loginUserAction(dni_cuit, password)
        const token = data.token ?? data.access
        if (!token) throw new Error('El login no devolvió un token de acceso')
          localStorage.setItem('token', token)
          localStorage.setItem('refresh', data.refresh)
          localStorage.setItem('type', 'user')
          localStorage.setItem('userId', dni_cuit)
          set({refresh:data.refresh, token, authStatus: 'authenticated', usertype: 'user', userId: dni_cuit})
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
      localStorage.removeItem('type');
      localStorage.removeItem('userId');
      set({ refresh: null, token: null, authStatus: 'not-authenticated', usertype: null, userId: null});
    },

    checkAuthStatus: async () => {
    try {
      const { token, refresh } = await checkAuthAction();
      const storedType = localStorage.getItem('type');
      const usertype = storedType === 'admin' || storedType === 'user' ? storedType : null;
      const userId = usertype === 'user' ? localStorage.getItem('userId') : null;
      set({
        token: token,
        refresh: refresh,
        authStatus: 'authenticated',
        usertype,
        userId,
      });
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      set({
        token: undefined,
        refresh: undefined,
        authStatus: 'not-authenticated',
        usertype: null,
        userId: null,
      });

      return false;
    }
    },
}))
