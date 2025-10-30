"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FileUploadAreaProps {
  onFilesSelected: (files: File[]) => void;
  isLoading: boolean;
  compact?: boolean;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "text/plain",
  "application/html",
];

export default function FileUploadArea({
  onFilesSelected,
  isLoading,
}: FileUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (
    files: File[]
  ): { valid: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Unsupported file type`);
      } else if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File size exceeds 50MB limit`);
      } else if (file.size === 0) {
        errors.push(`${file.name}: File is empty`);
      } else {
        validFiles.push(file);
      }
    });

    return { valid: validFiles, errors };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError("");

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const { valid, errors } = validateFiles(files);
      if (errors.length > 0) {
        setError(errors.join("; "));
      }
      if (valid.length > 0) {
        onFilesSelected(valid);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const { valid, errors } = validateFiles(files);
      if (errors.length > 0) {
        setError(errors.join("; "));
      }
      if (valid.length > 0) {
        onFilesSelected(valid);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`h-80 border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border/50 bg-secondary/20 hover:bg-secondary/30"
        }`}
      >
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Drag and drop your files here
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supported: PDF, DOC, DOCX, JPG, PNG, TXT (Max 50MB per file)
            </p>
          </div>
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="h-8 text-xs bg-primary hover:bg-primary/90"
          >
            Choose Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
            disabled={isLoading}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
