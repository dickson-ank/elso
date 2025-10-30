"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ChatMessage from "./chat-message";
import FileUploadArea from "./file-upload-area";
import FileList from "./file-list";
import { apiClient } from "@/lib/api-client";
import { handleApiError } from "@/lib/error-handler";
import { useAiChat } from "@/hooks/use-ai-chat";

interface User {
  id: string;
  name: string;
  email: string;
}

interface SystemMessage {
  id: string;
  role: "system";
  content: string;
  timestamp: Date;
  files: { name: string; size: number; id: string }[];
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

type ChatMessage = Message | SystemMessage;

interface UploadedFile {
  name: string;
  size: number;
  id: string;
  file: File;
}

export default function ChatInterface({ user }: { user: User }) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [stagedFiles, setStagedFiles] = useState<UploadedFile[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isWelcomeShown, setIsWelcomeShown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState("");
  const [fileContext, setFileContext] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);

  const { messages, isLoading, error, streamingContent, sendMessage } =
    useAiChat({
      fileContext,
    });

  // Show welcome message on first load
  useEffect(() => {
    if (!isWelcomeShown && messages.length === 0) {
      setChatMessages([
        {
          id: "welcome-1",
          role: "assistant",
          content: `Welcome, ${user.name}!\n\nI'm Elso, your AI-powered dental analysis assistant. Please upload your dental documents, images, or reports for analysis. I'll help you extract insights and provide professional recommendations.`,
          timestamp: new Date(),
        },
      ]);
      setIsWelcomeShown(true);
    }
  }, [user.name, isWelcomeShown, messages.length]);

  // Sync AI messages with chat messages
  useEffect(() => {
    if (messages.length > 0) {
      setChatMessages((prev) => {
        const welcomeMsg = prev.find((m) => m.id === "welcome-1");
        return welcomeMsg ? [welcomeMsg, ...messages] : messages;
      });
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    userScrolledUp.current = false;
  };

  // Track when user manually scrolls up
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      userScrolledUp.current = !isAtBottom;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Only auto-scroll if user hasn't manually scrolled up
  useEffect(() => {
    if (!userScrolledUp.current) {
      scrollToBottom();
    }
  }, [chatMessages, streamingContent]);

  const handleFileStaging = async (files: File[]) => {
    // Add files to staging
    const newFiles: UploadedFile[] = files.map((file) => ({
      name: file.name,
      size: file.size,
      id: Math.random().toString(36).substr(2, 9),
      file: file,
    }));
    setStagedFiles((prev) => [...prev, ...newFiles]);

    // Immediately show files in chat as a system message
    const fileMessage: SystemMessage = {
      id: `files-${Date.now()}`,
      role: "system",
      content: "",
      timestamp: new Date(),
      files: newFiles.map((f) => ({ name: f.name, size: f.size, id: f.id })),
    };

    setChatMessages((prev) => [...prev, fileMessage]);
  };

  const handleRemoveFile = (fileId: string) => {
    setStagedFiles((prev) => prev.filter((file) => file.id !== fileId));

    // Also remove from chat messages
    setChatMessages((prev) =>
      prev
        .map((msg) => {
          if (msg.role === "system" && msg.files) {
            return {
              ...msg,
              files: msg.files.filter((f) => f.id !== fileId),
            };
          }
          return msg;
        })
        .filter((msg) => msg.role !== "system" || msg.files.length > 0)
    );
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isProcessing) return;

    // Check if there are files to upload or a message to send
    if (stagedFiles.length === 0 && !inputValue.trim()) return;

    // Immediately show user message in chat
    if (inputValue.trim()) {
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: inputValue.trim(),
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, userMessage]);
    }

    const messageContent = inputValue.trim();
    setInputValue("");
    setIsProcessing(true);
    setApiError("");

    try {
      // Upload files if any are staged
      if (stagedFiles.length > 0) {
        const filesToUpload = stagedFiles.map((f) => f.file);
        const response = await apiClient.uploadFiles(filesToUpload);

        if (!response.success) {
          setApiError(response.error || "Failed to upload files");
          setIsProcessing(false);
          return;
        }

        // Create file context for AI
        const context = `Uploaded files: ${filesToUpload
          .map((f) => f.name)
          .join(", ")}`;
        setFileContext(context);

        // Build message with file info
        const fileMessage = messageContent
          ? messageContent
          : `I've uploaded ${
              stagedFiles.length
            } file(s) for analysis: ${filesToUpload
              .map((f) => f.name)
              .join(
                ", "
              )}. Please provide an initial analysis and summary of what you can see in these documents.`;

        await sendMessage(fileMessage);

        // Don't clear staged files - they stay in chat history
        setStagedFiles([]);
      } else if (messageContent) {
        // Just send text message
        await sendMessage(messageContent);
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setApiError(errorMessage);
      console.error("Upload error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border shadow-primary/30 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-43 h-10 mx-auto rounded-lg flex items-center justify-center">
              <span className="text-primary font-extrabold text-lg">
                ELSO DENTAL AI
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user.name}</span>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="h-8 text-xs"
            >
              Sign Out
            </Button>
            <DarkModeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content Area - Two Columns */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat Area */}
        <div
          ref={scrollContainerRef}
          className="hide-scrollbar flex-1 overflow-y-auto"
        >
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
            {chatMessages.map((message) => {
              if (message.role === "system") {
                return (
                  <div key={message.id}>
                    <FileList
                      stagedFiles={stagedFiles}
                      files={message.files}
                      isProcessing={false}
                      onRemoveFile={handleRemoveFile}
                    />
                  </div>
                );
              }

              // Only pass user/assistant messages to ChatMessage component
              return <ChatMessage key={message.id} message={message} />;
            })}

            {/* Error Alerts */}
            {apiError && (
              <Alert variant="destructive">
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Show streaming content while loading */}
            {isLoading && streamingContent && (
              <ChatMessage
                message={{
                  id: "streaming",
                  role: "assistant",
                  content: streamingContent,
                  timestamp: new Date(),
                }}
              />
            )}

            {/* Show loading indicator only when no streaming content yet */}
            {isLoading && !streamingContent && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary/40">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Right: Upload Sidebar */}
        <div className="w-80 overflow-y-auto">
          <div className="p-4 mt-12">
            <FileUploadArea
              onFilesSelected={handleFileStaging}
              isLoading={false}
            />
            {stagedFiles.length > 0 && (
              <div className="text-center mx-auto">
                <p className="text-base font-bold text-muted-foreground uppercase tracking-wide">
                  Uploaded Files ({stagedFiles.length})
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder={
                stagedFiles.length > 0
                  ? `Message with ${stagedFiles.length} file(s)...`
                  : "Ask Elso to analyse..."
              }
              value={inputValue}
              onSubmit={(value) => {
                setInputValue(value);
                handleSendMessage({
                  preventDefault: () => {},
                } as React.FormEvent);
              }}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading || isProcessing}
              className="flex-1 text-sm"
            />
            <Button
              type="submit"
              disabled={
                isLoading ||
                isProcessing ||
                (stagedFiles.length === 0 && !inputValue.trim())
              }
              className="h-9 px-4 text-sm"
            >
              {isLoading
                ? "Thinking..."
                : isProcessing
                ? "Processing..."
                : "Send"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
