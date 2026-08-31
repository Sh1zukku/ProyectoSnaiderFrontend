import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate } from 'react-router';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomFullScreenLoading from "@/components/CustomFullScreenLoading";
import { useAuthStore } from "./store/auth.store";


const userSchema = z.object({
  dni_cuit: z
    .string()
    .trim()
    .regex(/^(?:\d{8}|\d{11})$/, {
      message: "El DNI/CUIT debe tener 8 o 11 dígitos",
    }),
});

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

type UserForm = z.infer<typeof userSchema>;
type AdminForm = z.infer<typeof adminSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const {loginAdmin} = useAuthStore() 

  const userForm = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: { dni_cuit: "" },
  });

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

  const onUserSubmit = async (event: UserForm) => {
    navigate(`/user/${event.dni_cuit}`)
  };

  const onAdminSubmit = async (event: AdminForm) => {
    const username = event.username
    const password = event.password
    
    const isCorrect = await loginAdmin(username, password)
    
    if (isCorrect){
      navigate('/admin')
      return
    }

    toast.error('Usuario o contraseña no válidos')
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
        <CardDescription>
          Elegí el tipo de cuenta para continuar.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="usuario">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="usuario">Usuario</TabsTrigger>
            <TabsTrigger value="admin">Administrador</TabsTrigger>
          </TabsList>

          <TabsContent value="usuario" className="mt-6">
            <form
              onSubmit={userForm.handleSubmit(onUserSubmit)}
              className="space-y-4"
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="dni_cuit">DNI/CUIT</Label>
                <Input
                  id="dni_cuit"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="8 o 11 dígitos"
                  maxLength={11}
                  aria-invalid={!!userForm.formState.errors.dni_cuit}
                  {...userForm.register("dni_cuit")}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                    userForm.setValue("dni_cuit", digits, {
                      shouldValidate: userForm.formState.isSubmitted,
                    });
                  }}
                />
                {userForm.formState.errors.dni_cuit && (
                  <p className="text-sm text-destructive">
                    {userForm.formState.errors.dni_cuit.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={userForm.formState.isSubmitting}
              >
                {userForm.formState.isSubmitting ? "Ingresando…" : "Ingresar"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="admin" className="mt-6">
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}