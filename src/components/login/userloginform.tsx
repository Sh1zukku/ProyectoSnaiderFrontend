import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const userSchema = z
  .object({
    documentType: z.enum(["dni", "cuit"]),
    dni_cuit: z.string().trim(),
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

    const userForm = useForm<UserForm>({
        resolver: zodResolver(userSchema),
        defaultValues: { documentType: "dni", dni_cuit: "" },
    });

    const selectedDocumentType = userForm.watch("documentType");
    const maxLength = selectedDocumentType === "dni" ? 8 : 11;
    const placeholder = selectedDocumentType === "dni" ? "8 dígitos" : "11 dígitos";
    
    const onUserSubmit = async (event: UserForm) => {
        navigate(`/user/${event.dni_cuit}`)
    };

    return(
        <form
            onSubmit={userForm.handleSubmit(onUserSubmit)}
            className="space-y-4"
            noValidate
        >
            <div className="space-y-2">
                <Label>Tipo de documento</Label>
                <div className="inline-flex w-full rounded-full border border-slate-200 bg-slate-100 p-1">
                    <button
                        type="button"
                        onClick={() => {
                            userForm.setValue("documentType", "dni", {
                                shouldValidate: userForm.formState.isSubmitted,
                            });
                            userForm.setValue("dni_cuit", "", {
                                shouldValidate: userForm.formState.isSubmitted,
                            });
                        }}
                        className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                            selectedDocumentType === "dni"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500"
                        }`}
                    >
                        DNI
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            userForm.setValue("documentType", "cuit", {
                                shouldValidate: userForm.formState.isSubmitted,
                            });
                            userForm.setValue("dni_cuit", "", {
                                shouldValidate: userForm.formState.isSubmitted,
                            });
                        }}
                        className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                            selectedDocumentType === "cuit"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500"
                        }`}
                    >
                        CUIT
                    </button>
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