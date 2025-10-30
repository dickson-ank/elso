import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UseAiChatOptions {
  fileContext?: string;
}

export function useAiChat({ fileContext }: UseAiChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState("");

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);
      setStreamingContent("");

      try {
        // Prepare messages for API
        const apiMessages = [...messages, userMessage].map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        // Stream the response
        await apiClient.sendMessageStream(
          apiMessages,
          fileContext,
          // onChunk - called for each chunk of text
          (chunk) => {
            setStreamingContent((prev) => prev + chunk);
          },
          // onComplete - called when stream finishes
          (fullText) => {
            const assistantMessage: Message = {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              content: fullText,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
            setStreamingContent("");
            setIsLoading(false);
          },
          // onError - called on error
          (errorMessage) => {
            setError(errorMessage);
            setStreamingContent("");
            setIsLoading(false);
          }
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        setStreamingContent("");
        setIsLoading(false);
      }
    },
    [messages, fileContext]
  );

  return {
    messages,
    isLoading,
    error,
    streamingContent,
    sendMessage,
  };
}
