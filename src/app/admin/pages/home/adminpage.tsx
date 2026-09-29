import { useState } from "react";
import { CircleAlert, FileJson, FileText, LoaderCircle, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { saveDataAction } from "@/app/admin/action/savedata.action";
import { FileDropzone } from "@/components/admin/file-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageShell } from "@/components/layout/page-shell";
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
      toast.success(`Archivo "${file.name}" cargado.`);
    } catch {
      setMainError("No se pudo leer el archivo. Intentalo de nuevo.");
    }
  };

  const handleSubmit = async () => {
    if (!mainFile || isSubmitting) return;

    setMainError(null);
    setIsSubmitting(true);
    try {
      const file = new File([mainFile.content], mainFile.name, { type: "text/plain" });
      const fileName = mainFile.name;
      await saveDataAction(file);
      setMainFile(null);
      setMainError(null);
      toast.success(`Archivo "${fileName}" enviado.`);
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
        return `JSON válido, ${count} ${Array.isArray(parsed) ? "registros" : "propiedades"}`;
      } catch {
        return "El JSON no tiene un formato válido.";
      }
    }
    const lines = mainFile.content.split(/\r?\n/).filter((line) => line.trim());
    return `${lines.length} líneas. Primera: ${(lines[0] ?? "").slice(0, 110)}`;
  })();

  return (
    <PageShell
      size="narrow"
      title="Carga de despachos"
      description="Subí el archivo del día con los despachos. Se aceptan archivos .txt o .json."
    >
      <Card>
        <CardContent className="flex flex-col gap-4">
          <FileDropzone onFileAccepted={handleMainFile} onError={setMainError} />

          {mainError && (
            <p role="alert" className="flex items-start gap-2 text-sm text-destructive">
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {mainError}
            </p>
          )}

          {mainFile && (
            <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/40 p-4">
              <div className="flex items-start gap-3">
                {isJson ? (
                  <FileJson className="mt-0.5 size-5 text-brand" aria-hidden="true" />
                ) : (
                  <FileText className="mt-0.5 size-5 text-brand" aria-hidden="true" />
                )}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{mainFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(mainFile.size)} ({isJson ? "JSON" : "Texto plano"})
                  </p>
                  {mainPreview && (
                    <p className="max-w-xl text-xs text-muted-foreground">{mainPreview}</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Quitar archivo"
                onClick={() => setMainFile(null)}
              >
                <Trash2 />
              </Button>
            </div>
          )}

          <Button
            className="self-end"
            disabled={!mainFile || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? <LoaderCircle className="animate-spin" /> : <Send />}
            {isSubmitting ? "Enviando…" : "Enviar archivo"}
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}
