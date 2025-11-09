"use client";

import type React from "react";
import { X } from "lucide-react";



export default function FileItem({
  id,
  name,
  size,
  icon,
  onRemove,
}: FileItemProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="bg-muted rounded-lg p-3 flex items-center justify-between gap-2 hover:bg-muted/80 transition-colors group">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-medium text-foreground truncate"
            title={name}
          >
            {name}
          </p>
          <p className="text-xs text-muted-foreground">{formatSize(size)}</p>
        </div>
      </div>
      <button
        onClick={() => onRemove(id)}
        className="shrink-0 p-1 hover:bg-destructive/10 rounded transition-colors opacity-0 group-hover:opacity-100"
        type="button"
        title="Remove file"
      >
        <X size={14} className="text-destructive" />
      </button>
    </div>
  );
}
