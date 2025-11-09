"use client";

import { Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

// Define the custom components with proper typing
const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold mt-6 mb-3">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold mt-5 mb-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>
  ),
  p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
  ul: ({ children }) => (
    <ul className="list-disc ml-6 mb-3 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal ml-6 mb-3 space-y-1">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  code: ({ inline, children }) =>
    inline ? (
      <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ) : (
      <code className="block bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto font-mono text-sm my-2">
        {children}
      </code>
    ),
  pre: ({ children }) => <pre className="my-2">{children}</pre>,
  table: ({ children }) => (
    <div className="overflow-x-auto my-3">
      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border-b border-gray-300 dark:border-gray-700">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-2 text-left font-semibold border border-gray-300 dark:border-gray-700">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
      {children}
    </td>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic my-3">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-blue-600 dark:text-blue-400 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
};
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
            : "max-w-full text-primary dark:text-card-foreground text-sm md:text-base font-medium dark:font-medium"
        }`}
      >
        <div className="text-sm space-y-3">
          <ReactMarkdown
            components={markdownComponents}
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
          >
            {message.content}
          </ReactMarkdown>
        </div>
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
