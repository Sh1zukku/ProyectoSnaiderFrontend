import { RouterProvider } from 'react-router'
import { appRouter } from './router/app_router'
import {QueryClient, QueryClientProvider, useQuery} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {Toaster} from 'sonner'
import type { PropsWithChildren } from 'react'
import CustomFullScreenLoading from './components/CustomFullScreenLoading'
import { useAuthStore } from './app/auth/store/auth.store'
import { ThemeProvider } from './components/theme-provider'


const queryClient = new QueryClient


const CheckAuthProvider = ({ children }: PropsWithChildren) => {
  const { checkAuthStatus } = useAuthStore();

  const { isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: checkAuthStatus,
    retry: false,
    refetchInterval: 1000 * 60 * 1.5,
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <CustomFullScreenLoading />;

  return children;
};


function SnaiderApp() {

  return (
    (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Toaster />
          <CheckAuthProvider>
            <RouterProvider router={appRouter} />
          </CheckAuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </QueryClientProvider>


    ))
}

export default SnaiderApp
