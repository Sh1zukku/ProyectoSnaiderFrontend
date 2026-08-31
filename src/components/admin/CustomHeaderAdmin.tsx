import { ShieldCheck } from "lucide-react"
import { Button } from "../ui/button"
import { useAuthStore } from "@/app/auth/store/auth.store";
import { useNavigate } from "react-router";
import { ThemeToggle } from "../theme-toggle";

export function AdminHeader() {
    const navigate = useNavigate();
    const {  logout } = useAuthStore();
    
    const handleLogout = async()=>{
        logout()
        navigate('/')
    }

    return (

        <header className="border-b border-border bg-card">
            <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <ShieldCheck className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Panel de administrador</h1>
                        <p className="text-sm text-muted-foreground">
                            Carga de los despachos del dia
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <img
                        src="/snaider.png"
                        alt="Logo de Transporte Snaider"
                        className="h-15 w-60 rounded-md object-cover"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        size="default"
                        className="min-w-[120px] px-4"
                    >
                        Cerrar sesión
                    </Button>
                </div>
            </div>
        </header>
  )}