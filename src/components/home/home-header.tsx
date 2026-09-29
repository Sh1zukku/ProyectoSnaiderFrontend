import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router'

import { ThemeToggle } from '@/components/theme-toggle'
import { useAuthStore } from '@/app/auth/store/auth.store'
import { Button } from '@/components/ui/button'

export function SiteHeader() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-3">
          <img
            src="/snaider.png"
            alt="Transporte Snaider"
            className="h-9 w-auto object-contain"
          />
          <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
            Seguimiento de envíos
          </span>
        </div>

        <nav className="flex items-center gap-2" aria-label="Navegación principal">
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut aria-hidden="true" />
            Salir
          </Button>
        </nav>
      </div>
    </header>
  )
}
