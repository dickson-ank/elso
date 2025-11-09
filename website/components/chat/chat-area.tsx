"use client";

import type React from "react";
import MessageBubble from "./message-bubble";
import LoadingSpinner from "@/components/common/loading-spinner";

interface ChatAreaProps {
  messages: any[];
  isLoading: boolean;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatArea({
  messages,
  isLoading,
  chatEndRef,
}: ChatAreaProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="flex flex-col gap-4 p-4 md:p-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Start a conversation
                </h2>
                <p className="text-muted-foreground text-sm">
                  Upload files and ask questions to get started
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card text-card-foreground rounded-lg px-4 py-3 shadow-sm">
                <LoadingSpinner />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
