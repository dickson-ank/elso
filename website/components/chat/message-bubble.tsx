"use client";

import { Download } from "lucide-react";

interface MessageBubbleProps {
  message: {
    type: "user" | "assistant";
    content: string;
    files?: any[];
    timestamp?: Date;
  };
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.type === "user";

  const handleDownloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-lg px-4 py-3 max-w-2xl ${
          isUser
            ? "bg-muted dark:bg-muted/30 text-foreground dark:text-foreground text-sm font-medium"
            : "text-card-foreground text-sm md:text-base font-normal dark:font-medium"
        }`}
      >
        <p className="leading-relaxed text-pretty">{message.content}</p>

        {message.files && message.files.length > 0 && (
          <div className="mt-2 pt-2 border-t border-current border-opacity-20 space-y-1">
            {message.files.map((file, idx) => (
              <div
                key={idx}
                className="text-xs md:text-sm opacity-80 truncate flex items-center justify-between gap-1 hover:opacity-100 cursor-pointer"
                onClick={() => handleDownloadFile(file)}
              >
                <span>📎 {file.name}</span>
                <Download size={12} className="shrink-0" />
              </div>
            ))}
          </div>
        )}

        {message.timestamp && (
          <div className="text-xs opacity-60 mt-1">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>
    </div>
  );
}
