import type { Components } from "react-markdown";

export const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold mt-6 mb-3 text-purple-900 dark:text-purple-300 border-b-2 border-purple-200 dark:border-purple-800 pb-2">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold mt-5 mb-2 text-purple-800 dark:text-purple-400">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold mt-4 mb-2 text-purple-700 dark:text-purple-500">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-3 leading-relaxed text-slate-700 dark:text-slate-300">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc ml-6 mb-3 space-y-1 marker:text-purple-600 dark:marker:text-purple-400">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal ml-6 mb-3 space-y-1 marker:text-purple-600 dark:marker:text-purple-400">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed text-slate-700 dark:text-slate-300">
      {children}
    </li>
  ),
  code: ({ inline, children }) =>
    inline ? (
      <code className="bg-purple-50 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded font-mono text-sm">
        {children}
      </code>
    ) : (
      <code className="block bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-4 rounded-lg overflow-x-auto font-mono text-sm my-3 border border-slate-200 dark:border-slate-700">
        {children}
      </code>
    ),
  pre: ({ children }) => <pre className="my-2">{children}</pre>,
  table: ({ children }) => (
    <div className="overflow-x-auto my-4 rounded-lg shadow-md">
      <table className="min-w-full border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-slate-900 hover:text-black dark:hover:text-white [hover:bg-slate-900/70]! text-white">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="bg-white dark:bg-slate-800/50">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="border-b border-slate-200 dark:border-purple-50 hover:bg-slate-200 dark:hover:bg-slate-950/15 transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left font-semibold text-sm tracking-wide">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 last:border-r-0">
      {children}
    </td>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-purple-600 dark:border-purple-500 bg-purple-50 dark:bg-purple-950/20 pl-4 pr-4 py-2 my-3 rounded-r text-slate-700 dark:text-slate-300">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 underline decoration-purple-300 dark:decoration-purple-700 underline-offset-2 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-slate-900 dark:text-slate-100">
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em className="italic text-slate-600 dark:text-slate-400">{children}</em>
  ),
};
