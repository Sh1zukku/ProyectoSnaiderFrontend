import { useState } from "react";
import { CircleAlert, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileDropzone } from "@/components/admin/file-dropzone";
import { generateAccounts, parseUsersFile, type GeneratedAccount } from "@/lib/account-generator";

interface SecondaryUploadDialogProps {
  onAccountsGenerated?: (accounts: GeneratedAccount[], fileName: string) => void;
}


export function SecondaryUploadDialog({ onAccountsGenerated }: SecondaryUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);
    setIsProcessing(true);
    try {
      const content = await file.text();
      const users = parseUsersFile(file.name, content);
      const accounts = generateAccounts(users);
      onAccountsGenerated?.(accounts, file.name);
      toast.success(`${accounts.length} cuenta${accounts.length === 1 ? "" : "s"} generada${accounts.length === 1 ? "" : "s"} desde ${file.name}.`);

      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo procesar el archivo.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setError(null);
      }}
    >
      <DialogTrigger render={<Button variant="secondary" />}>
        <UserPlus />
        Cargar archivo secundario
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Archivo secundario</DialogTitle>
          <DialogDescription>
            Sube un archivo .txt o .json con los usuarios. Se generarán las nuevas cuentas con una
            contraseña temporal.
          </DialogDescription>
        </DialogHeader>
        <FileDropzone compact onFileAccepted={handleFile} onError={setError} />
        <div className="rounded-md bg-muted/60 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Formato esperado</p>
          <p className="mt-1">
            TXT: una línea por usuario — <code>nombre,email</code>
          </p>
          <p className="mt-1">
            JSON: <code>{'[{ "name": "Ana", "email": "ana@mail.com" }]'}</code>
          </p>
        </div>
        {error && (
          <p role="alert" className="flex items-start gap-2 text-sm text-destructive">
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        )}
        {isProcessing && <p className="text-xs text-muted-foreground">Procesando archivo…</p>}
      </DialogContent>
    </Dialog>
  );
}