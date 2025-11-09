"use client";

import { useState, useRef, useEffect } from "react";
import ChatArea from "./chat-area";
import ChatInput from "./chat-input";
import UploadArea from "./upload-area";
import Header from "./header";

interface ChatPageProps {
  onLogout: () => void;
}

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  files?: File[];
  timestamp: Date;
}

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export default function ChatPage({ onLogout }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleFileUpload = (files: FileList) => {
    const newFiles: UploadedFile[] = [];

    Array.from(files).forEach((file) => {
      const isDuplicate = uploadedFiles.some(
        (uf) => uf.name === file.name && uf.size === file.size
      );
      const maxSize = 50 * 1024 * 1024; // 50MB limit

      if (isDuplicate) {
        setError("File already uploaded");
        return;
      }

      if (file.size > maxSize) {
        setError(`File "${file.name}" exceeds 50MB limit`);
        return;
      }

      newFiles.push({
        id: `${Date.now()}_${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
      });
    });

    if (newFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      setError(null);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() && uploadedFiles.length === 0) return;

    setError(null);
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      type: "user",
      content: content || "(Files only)",
      files: uploadedFiles.map((f) => f.file),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUploadedFiles([]);
    setIsLoading(true);

    try {
      // Prepare form data with files
      const formData = new FormData();
      formData.append("message", content);
      uploadedFiles.forEach((uf) => {
        formData.append("files", uf.file);
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: `msg_${Date.now()}_resp`,
        type: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
      // Remove the user message if sending failed
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header
        userName={localStorage.getItem("userName") || "User"}
        onLogout={onLogout}
      />

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm px-4 py-2 border-b border-destructive/20">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right text-xs hover:opacity-70"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <ChatArea
          messages={messages}
          isLoading={isLoading}
          chatEndRef={chatEndRef}
        />

        <div className="hidden lg:flex flex-col w-96 bg-card border-l border-border">
          <UploadArea
            uploadedFiles={uploadedFiles}
            onFileUpload={handleFileUpload}
            onRemoveFile={handleRemoveFile}
          />
        </div>

        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        <div
          className={`fixed right-0 top-0 h-screen w-96 bg-card border-l border-border transform transition-transform lg:hidden z-50 overflow-y-auto ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <UploadArea
            uploadedFiles={uploadedFiles}
            onFileUpload={handleFileUpload}
            onRemoveFile={handleRemoveFile}
          />
        </div>
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onMobileUploadToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        fileCount={uploadedFiles.length}
      />
    </div>
  );
}
