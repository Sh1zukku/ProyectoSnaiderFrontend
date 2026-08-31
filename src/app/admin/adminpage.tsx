import { useState } from "react";
import { CircleAlert, FileJson, FileText, FileUp, LoaderCircle, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { saveDataAction } from "@/app/admin/action/savedata.action";
import { FileDropzone } from "@/components/admin/file-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFileSize } from "@/lib/account-generator";




interface LoadedFile {
  name: string;
  size: number;
  content: string;
}

export function AdminPage() {
  
  const [mainFile, setMainFile] = useState<LoadedFile | null>(null);
  const [mainError, setMainError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const handleMainFile = async (file: File) => {
    setMainError(null);
    try {
      const content = await file.text();
      setMainFile({ name: file.name, size: file.size, content });
      toast.success(`Archivo principal "${file.name}" cargado correctamente.`);
    } catch {
      setMainError("No se pudo leer el archivo. Inténtalo de nuevo.");
    }
  };

  

  const handleSubmit = async () => {
    if (!mainFile || isSubmitting) return;

    setMainError(null);
    setIsSubmitting(true);
    try {
      const file = new File([mainFile.content], mainFile.name, { type: "text/plain" });
      await saveDataAction(file);
      toast.success(`Archivo "${mainFile.name}" enviado correctamente.`);
    } catch (error) {
      setMainError(error instanceof Error ? error.message : "No se pudo enviar el archivo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isJson = mainFile?.name.toLowerCase().endsWith(".json") ?? false;

  const mainPreview = (() => {
    if (!mainFile) return null;
    if (isJson) {
      try {
        const parsed: unknown = JSON.parse(mainFile.content);
        const count = Array.isArray(parsed) ? parsed.length : Object.keys(parsed as object).length;
        return `JSON válido · ${count} ${Array.isArray(parsed) ? "registros" : "propiedades"}`;
      } catch {
        return "El JSON no tiene un formato válido.";
      }
    }
    const lines = mainFile.content.split(/\r?\n/).filter((line) => line.trim());
    return `${lines.length} líneas · ${lines.slice(0, 3).join(" · ").slice(0, 140)}${lines.join("").length > 140 ? "…" : ""}`;
  })();

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileUp className="size-4" />
            Despachos del dia
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FileDropzone onFileAccepted={handleMainFile} onError={setMainError} />

          {mainError && (
            <p role="alert" className="flex items-start gap-2 text-sm text-destructive">
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              {mainError}
            </p>
          )}

          {mainFile && (
            <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/40 p-4">
              <div className="flex items-start gap-3">
                {isJson ? (
                  <FileJson className="mt-0.5 size-5 text-primary" />
                ) : (
                  <FileText className="mt-0.5 size-5 text-primary" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">{mainFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(mainFile.size)} · {isJson ? "JSON" : "Texto plano"}
                  </p>
                  {mainPreview && (
                    <p className="mt-2 max-w-xl truncate text-xs text-muted-foreground">{mainPreview}</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Quitar archivo principal"
                onClick={() => setMainFile(null)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          )}

          <Button
            className="self-end"
            disabled={!mainFile || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? <LoaderCircle className="animate-spin" /> : <Send />}
            {isSubmitting ? "Enviando..." : "Enviar archivo"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}