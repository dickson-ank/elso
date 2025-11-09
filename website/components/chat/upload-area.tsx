"use client";

import type React from "react";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, ImageIcon, File } from "lucide-react";
import FileItem from "@/components/common/file-item";


export default function UploadArea({
  uploadedFiles,
  onFileUpload,
  onRemoveFile,
}: UploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    onFileUpload(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileUpload(e.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) {
      return <ImageIcon size={14} className="text-blue-500" />;
    }
    if (["pdf", "doc", "docx", "txt"].includes(ext || "")) {
      return <FileText size={14} className="text-red-500" />;
    }
    return <File size={14} className="text-gray-500" />;
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {uploadedFiles.length > 0 && (
        <div className="bg-notif/10 text-notif text-xs font-medium px-3 py-2 rounded-lg">
          {uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""}{" "}
          selected
        </div>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
          isDragActive ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          accept="*/*"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          type="button"
          className="w-full"
        >
          <Upload size={20} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            {isDragActive ? "Drop files here" : "Drag files or click to upload"}
          </p>
        </button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="space-y-2">
            {uploadedFiles.map((fileItem) => (
              <FileItem
                key={fileItem.id}
                id={fileItem.id}
                name={fileItem.name}
                size={fileItem.size}
                icon={getFileIcon(fileItem.name)}
                onRemove={onRemoveFile}
              />
            ))}
          </div>
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        className="w-2/3 mx-auto bg-transparent"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={14} className="mr-2" />
        Add Files
      </Button>
    </div>
  );
}
