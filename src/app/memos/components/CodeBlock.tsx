// /app/memos/components/CodeBlock.tsx
'use client';

import { useState } from 'react';

const CopyIcon = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> );
const CheckIcon = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> );

export default function CodeBlock({ children, ...props }: any) {
  const [isCopied, setIsCopied] = useState(false);
  
  const codeText = children?.[0]?.props?.children?.[0] ?? '';
  const lines = codeText.split('\n');

  if (lines[lines.length - 1] === '') {
    lines.pop();
  }

  const handleCopy = () => {
    if (typeof codeText === 'string') {
      navigator.clipboard.writeText(codeText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="relative bg-zinc-800 dark:bg-zinc-900 rounded-lg shadow-md my-4 text-sm font-mono">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 z-10 p-1.5 text-gray-400 bg-zinc-700/50 dark:bg-zinc-800/50 rounded-md hover:text-white hover:bg-zinc-600 dark:hover:bg-zinc-700 transition-all"
        aria-label="Copy code to clipboard"
      >
        {isCopied ? <CheckIcon /> : <CopyIcon />}
      </button>

      <div className="overflow-x-auto p-4">
        <table className="w-full text-left border-collapse">
          <tbody>
            {lines.map((line, index) => (
              <tr key={index}>
                {/* 【已修复】移除了固定宽度 w-10，改用左右内边距 px-4 */}
                {/* 这使得列宽度可以根据行号的位数（如 9, 10, 100）自动调整 */}
                <td className="px-4 text-gray-500 text-right select-none align-top">
                  {index + 1}
                </td>

                <td className="text-white whitespace-pre align-top">
                  {line}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
