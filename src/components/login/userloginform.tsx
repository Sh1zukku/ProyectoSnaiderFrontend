import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuthStore } from "@/app/auth/store/auth.store";
import { toast } from "sonner";

const userSchema = z
  .object({
    documentType: z.enum(["dni", "cuit"]),
    dni_cuit: z.string().trim(),
        password: z.string().min(1, { message: "Ingresá tu contraseña" }),
  })
  .superRefine((data, ctx) => {
    const value = data.dni_cuit.replace(/\D/g, "");

    if (data.documentType === "dni" && !/^\d{8}$/.test(value)) {
      ctx.addIssue({
        code: "custom",
        path: ["dni_cuit"],
        message: "El DNI debe tener 8 dígitos",
      });
    }

    if (data.documentType === "cuit" && !/^\d{11}$/.test(value)) {
      ctx.addIssue({
        code: "custom",
        path: ["dni_cuit"],
        message: "El CUIT debe tener 11 dígitos",
      });
    }
  });

type UserForm = z.infer<typeof userSchema>;

export function UserLoginForm (){
    const navigate = useNavigate();
    const { loginUser } = useAuthStore();

    const userForm = useForm<UserForm>({
        resolver: zodResolver(userSchema),
        defaultValues: { documentType: "dni", dni_cuit: "", password: "" },
    });

    const selectedDocumentType = useWatch({
        control: userForm.control,
        name: "documentType",
    });
    const maxLength = selectedDocumentType === "dni" ? 8 : 11;
    const placeholder = selectedDocumentType === "dni" ? "8 dígitos" : "11 dígitos";
    
    const onUserSubmit = async (event: UserForm) => {
        const isAuthenticated = await loginUser(event.dni_cuit, event.password);
        if (isAuthenticated) {
            navigate(`/user/${event.dni_cuit}`);
            return;
        }

        toast.error("Documento o contraseña no válidos");
    };

    return(
        <form
            onSubmit={userForm.handleSubmit(onUserSubmit)}
            className="space-y-4"
            noValidate
        >
            <div className="space-y-2">
                <Label>Tipo de documento</Label>
                <div
                    role="group"
                    aria-label="Tipo de documento"
                    className="grid w-full grid-cols-2 gap-0.5 rounded-lg border border-border bg-muted p-0.5"
                >
                    {(["dni", "cuit"] as const).map((type) => {
                        const active = selectedDocumentType === type;
                        return (
                            <button
                                key={type}
                                type="button"
                                aria-pressed={active}
                                onClick={() => {
                                    userForm.setValue("documentType", type, {
                                        shouldValidate: userForm.formState.isSubmitted,
                                    });
                                    userForm.setValue("dni_cuit", "", {
                                        shouldValidate: userForm.formState.isSubmitted,
                                    });
                                }}
                                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                                    active
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {type.toUpperCase()}
                            </button>
                        );
                    })}
                </div>
                {userForm.formState.errors.documentType && (
                    <p className="text-sm text-destructive">
                        {userForm.formState.errors.documentType.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="dni_cuit">
                    {selectedDocumentType === "dni" ? "DNI" : "CUIT"}
                </Label>
                <Input
                  id="dni_cuit"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder={placeholder}
                  maxLength={maxLength}
                  aria-invalid={!!userForm.formState.errors.dni_cuit}
                  {...userForm.register("dni_cuit")}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, maxLength);
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

                        <div className="space-y-2">
                                <Label htmlFor="user-password">Contraseña</Label>
                                <Input
                                    id="user-password"
                                    type="password"
                                    autoComplete="current-password"
                                    aria-invalid={!!userForm.formState.errors.password}
                                    {...userForm.register("password")}
                                />
                                {userForm.formState.errors.password && (
                                    <p className="text-sm text-destructive">
                                        {userForm.formState.errors.password.message}
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
    )
}