import { useRef, useState, type DragEvent } from "react";
import { CloudUpload } from "lucide-react";

import { isAcceptedFile } from "@/lib/account-generator";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFileAccepted: (file: File) => void;
  onError?: (message: string) => void;
  compact?: boolean;
}

export function FileDropzone({ onFileAccepted, onError, compact }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!isAcceptedFile(file.name)) {
      onError?.(`"${file.name}" no es válido. Solo se aceptan archivos .txt o .json.`);
      return;
    }
    onFileAccepted(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Zona de carga de archivo"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/40 text-center transition-colors hover:border-primary/50 hover:bg-muted",
        isDragging && "border-primary bg-accent",
        compact ? "px-4 py-8" : "px-6 py-12",
      )}
    >
      <CloudUpload className={cn("text-muted-foreground", compact ? "size-8" : "size-10")} />
      <p className="text-sm font-medium text-foreground">
        Arrastra tu archivo aquí o <span className="text-primary underline underline-offset-2">haz clic para elegirlo</span>
      </p>
      <p className="text-xs text-muted-foreground">Formatos aceptados: .txt o .json</p>
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.json"
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
    </div>
  );
}