import { ThemeProvider } from '@/components/theme-provider'
import { SiteHeader } from '@/components/home/home-header'
import './style.css'
import { Outlet } from 'react-router'

export const HomeLayout = () => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <div className="min-h-screen bg-background">
          <SiteHeader />
          <Outlet />
        </div>
      </ThemeProvider>
    </div>
  )
}
