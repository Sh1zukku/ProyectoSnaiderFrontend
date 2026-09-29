import { FileUp, LogOut, PackageSearch, UsersRound } from "lucide-react"
import { NavLink, useNavigate } from "react-router"

import { useAuthStore } from "@/app/auth/store/auth.store";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button"
import { ThemeToggle } from "../theme-toggle"

const SECTIONS = [
  { to: "/admin", label: "Carga", icon: FileUp, end: true },
  { to: "/admin/shipments", label: "Envíos", icon: PackageSearch, end: false },
  { to: "/admin/clients", label: "Clientes", icon: UsersRound, end: false },
]

export function AdminHeader() {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-3">
                <div className="flex items-center gap-3">
                    <img
                        src="/snaider.png"
                        alt="Transporte Snaider"
                        className="h-9 w-auto object-contain"
                    />
                    <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
                        Administración
                    </span>
                </div>

                <nav
                    aria-label="Secciones de administración"
                    className="order-last flex w-full items-center gap-1 sm:order-none sm:w-auto"
                >
                    {SECTIONS.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                cn(
                                    "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    isActive
                                        ? "bg-accent text-accent-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                )
                            }
                        >
                            <Icon className="size-4" aria-hidden="true" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button onClick={handleLogout} variant="outline" size="sm">
                        <LogOut aria-hidden="true" />
                        Cerrar sesión
                    </Button>
                </div>
            </div>
        </header>
  )}
