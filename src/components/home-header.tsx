import { ThemeToggle } from '@/components/theme-toggle'
import { currentUser, initials } from '@/lib/user'
import { Link } from 'react-router'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-full bg-brand text-xs font-semibold text-brand-foreground"
          >
            {initials(currentUser.name)}
          </span>
          <div className="flex flex-col leading-tight">
            <p className="text-sm font-medium text-foreground">
              Hola, {currentUser.name.split(' ')[0]}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {currentUser.role} · {currentUser.branch}
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-3" aria-label="Navegación principal">
          <ThemeToggle />
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            Salir
          </Link>
        </nav>
      </div>
    </header>
  )
}
