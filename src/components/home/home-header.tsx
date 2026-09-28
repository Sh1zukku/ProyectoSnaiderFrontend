import { ThemeToggle } from '@/components/theme-toggle'
import { useAuthStore } from '@/app/auth/store/auth.store'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'

export function SiteHeader() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col leading-tight">
            <p className="text-sm font-semibold text-foreground">Transporte Snaider</p>
            <p className="text-xs text-muted-foreground">Sistema de gestión</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <img
            src="/snaider.png"
            alt="Logo de Transporte Snaider"
            className="h-15 w-60 rounded-md object-cover"
          />
        </div>

        <nav className="flex items-center gap-3" aria-label="Navegación principal">
          <ThemeToggle />
          <Button variant="outline" onClick={handleLogout}>
            Salir
          </Button>
        </nav>
      </div>
    </header>
  )
}
