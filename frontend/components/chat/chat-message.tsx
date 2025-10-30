"use client"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChatMessage({ message }: { message: Message }) {
  const isAssistant = message.role === "assistant"

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className={`flex ${isAssistant ? "justify-start" : "justify-end"} gap-2`}>
      {isAssistant && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
          <span className="text-xs font-bold text-primary">AI</span>
        </div>
      )}

      <div className="flex flex-col gap-1 max-w-xs lg:max-w-md">
        <div
          className={`px-4 py-3 rounded-lg text-sm leading-relaxed ${
            isAssistant
              ? "bg-secondary/40 text-foreground border border-border/50 rounded-tl-none"
              : "bg-primary text-primary-foreground rounded-tr-none"
          }`}
        >
          <p className="whitespace-pre-wrap wrap-break">{message.content}</p>
        </div>
        <span className={`text-xs text-muted-foreground px-1 ${isAssistant ? "text-left" : "text-right"}`}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  )
}
