import * as React from "react";

import { cn } from "@/lib/utils";

interface ChatInputProps
  extends Omit<React.ComponentProps<"textarea">, "onSubmit"> {
  onSubmit?: (value: string) => void;
  maxRows?: number;
}

function Input({
  className,
  onSubmit,
  maxRows = 8,
  ...props
}: ChatInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const maxHeight = lineHeight * maxRows;

      textarea.style.height = Math.min(scrollHeight, maxHeight) + "px";
      textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
    };

    adjustHeight();
    textarea.addEventListener("input", adjustHeight);

    return () => textarea.removeEventListener("input", adjustHeight);
  }, [maxRows]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter without shift = submit
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value && onSubmit) {
        onSubmit(value);
        e.currentTarget.value = "";
        // Reset height after submission
        e.currentTarget.style.height = "auto";
      }
    }

    // Call original onKeyDown if provided
    props.onKeyDown?.(e);
  };

  return (
    <textarea
      ref={textareaRef}
      data-slot="input"
      rows={1}
      className={cn(
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 resize-none rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}

export { Input };
