import { ThemeToggle } from '@/components/theme-toggle'
import { Link } from 'react-router'

export function SiteHeader() {
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
          <Link
            className="inline-flex items-center justify-center rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            to="/"
          >
            Salir
          </Link>
        </nav>
      </div>
    </header>
  )
}
