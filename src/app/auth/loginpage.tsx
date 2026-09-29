import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserLoginForm } from "@/components/login/userloginform";
import { AdminLoginForm } from "@/components/login/adminloginform";

export function LoginPage() {
  const [activeTab, setActiveTab] = useState<"usuario" | "admin">("usuario");

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-4">
        <img
          src="/snaider.png"
          alt="Transporte Snaider"
          className="h-10 w-auto object-contain"
        />
        <div className="space-y-1">
          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
          <CardDescription>
            Ingresá con tu DNI o CUIT para ver tus envíos, o con tu cuenta de
            administrador para gestionarlos.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "usuario" | "admin")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="usuario">Usuario</TabsTrigger>
            <TabsTrigger value="admin">Administrador</TabsTrigger>
          </TabsList>

          <TabsContent value="usuario" className="mt-6">
            <UserLoginForm />
          </TabsContent>

          <TabsContent value="admin" className="mt-6">
            <AdminLoginForm onLoginError={() => setActiveTab("admin")} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
