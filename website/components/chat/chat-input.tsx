"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, Menu, Loader } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onMobileUploadToggle: () => void;
  fileCount: number;
}

export default function ChatInput({
  onSendMessage,
  isLoading,
  onMobileUploadToggle,
  fileCount,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-card border-t border-border px-3 md:px-4 py-3 md:py-4">
      <div className="flex gap-2 mx-auto md:gap-3 items-end">
        <button
          onClick={onMobileUploadToggle}
          className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors shrink-0 relative"
          type="button"
          title="Toggle file upload panel"
        >
          <Menu size={20} className="text-primary" />
          {fileCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              {fileCount}
            </span>
          )}
        </button>

        <div className="flex-1 flex flex-col gap-2 max-w-4xl">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add message..."
            className="flex-1 bg-input text-foreground placeholder-muted-foreground rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-10 max-h-[120px] transition-colors scrollbar-hide"
            rows={1}
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={isLoading || !message.trim()}
          className="shrink-0 px-3 relative"
          title={isLoading ? "Sending..." : "Send message"}
        >
          {isLoading ? (
            <Loader size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </Button>
      </div>
    </div>
  );
}
