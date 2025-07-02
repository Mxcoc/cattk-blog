// /app/memos/components/CodeBlock.tsx
'use client';

import { useState } from 'react';

const CopyIcon = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> );
const CheckIcon = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> );

export default function CodeBlock({ children, ...props }: any) {
  const [isCopied, setIsCopied] = useState(false);
  
  const codeText = children?.[0]?.props?.children?.[0] ?? '';
  const lines = codeText.split('\n');

  // 如果最后一行是空的（通常由末尾的换行符产生），则移除它以避免多余的行号
  if (lines.length > 1 && lines[lines.length - 1] === '') {
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
            {/* 【已修复】为 map 的参数 line 和 index 添加了明确的类型 */}
            {lines.map((line: string, index: number) => (
              <tr key={index}>
                <td className="pr-4 text-gray-500 text-right select-none align-top">
                  {index + 1}
                </td>

                <td className="text-white whitespace-pre align-top">
                  {/* 为了防止空行高度坍缩，我们用一个空格来占位 */}
                  {line === '' ? ' ' : line}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
