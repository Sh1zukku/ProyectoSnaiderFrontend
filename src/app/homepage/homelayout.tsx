import { SiteHeader } from '@/components/home/home-header'
import { Outlet } from 'react-router'

export const HomeLayout = () => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <SiteHeader />
      <Outlet />
    </div>
  )
}
