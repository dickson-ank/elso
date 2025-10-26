"use client";

import { Button } from "@/components/ui/button";

interface UploadedFile {
  name: string;
  size: number;
  id: string;
}

interface FileListProps {
  files: UploadedFile[];
  isProcessing: boolean;
  onRemoveFile?: (fileId: string) => void;
}

export default function FileList({
  files,
  isProcessing,
  onRemoveFile,
}: FileListProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "jpg":
      case "jpeg":
      case "png":
        return "🖼️";
      case "txt":
        return "📋";
      default:
        return "📎";
    }
  };

  return (
    <div className="bg-secondary/20 border border-border/50 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Uploaded Files ({files.length})
        </p>
        {isProcessing && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
            <span className="text-xs text-muted-foreground">Processing...</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center gap-3 p-2 rounded bg-background/50 hover:bg-background transition-colors"
          >
            <div className="text-lg shrink-0">
              {getFileIcon(file.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate font-medium">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
            {onRemoveFile && !isProcessing && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFile(file.id)}
                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            )}
          </div>
        ))}
      </div>

      {isProcessing && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <p className="text-xs text-muted-foreground">
              Awaiting response from backend...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
