import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Label } from "../ui/label";
import { useAuthStore } from "@/app/auth/store/auth.store";
import { toast } from "sonner";
import CustomFullScreenLoading from "../CustomFullScreenLoading";
import { Input } from "../ui/input";
import { Button } from "../ui/button";


const adminSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "El usuario debe tener al menos 3 caracteres" })
    .max(50, { message: "El usuario debe tener menos de 50 caracteres" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .max(100, { message: "La contraseña debe tener menos de 100 caracteres" }),
});

type AdminForm = z.infer<typeof adminSchema>;

type AdminLoginFormProps = {
    onLoginError?: () => void;
};

export function AdminLoginForm ({ onLoginError }: AdminLoginFormProps) {
    const navigate = useNavigate();
    const {loginAdmin} = useAuthStore() 

    const adminForm = useForm<AdminForm>({
        resolver: zodResolver(adminSchema),
        defaultValues: { username: "", password: "" },
    });

    if (adminForm.formState.isSubmitting) {
        return (
        <CustomFullScreenLoading
            title="Iniciando sesión"
            message="Esperando respuesta del servidor"
            ariaLabel="Iniciando sesión"
        />
        );
    }

    const onAdminSubmit = async (event: AdminForm) => {
        const username = event.username
        const password = event.password
    
        const isCorrect = await loginAdmin(username, password)
    
        if (isCorrect){
            navigate('/admin')
            return
        }

        onLoginError?.();
        toast.error('Usuario o contraseña no válidos')
    };

    return(
        <form
              onSubmit={adminForm.handleSubmit(onAdminSubmit)}
              className="space-y-4"
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  placeholder="admin"
                  aria-invalid={!!adminForm.formState.errors.username}
                  {...adminForm.register("username")}
                />
                {adminForm.formState.errors.username && (
                  <p className="text-sm text-destructive">
                    {adminForm.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={!!adminForm.formState.errors.password}
                  {...adminForm.register("password")}
                />
                {adminForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {adminForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={adminForm.formState.isSubmitting}
              >
                {adminForm.formState.isSubmitting ? "Ingresando…" : "Ingresar"}
              </Button>
            </form>
    )
}