// /app/memos/components/CodeBlock.tsx
'use client';

import { useState } from 'react';

const CopyIcon = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> );
const CheckIcon = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> );

// 【已修复】为 props 中的 children 属性添加了 `?`，使其变为可选，以匹配 ReactMarkdown 的类型要求
export default function CodeBlock({ children, ...props }: { children?: React.ReactNode, [key: string]: any }) {
  const [isCopied, setIsCopied] = useState(false);
  
  // 这段代码使用了可选链（?.），因此即使 children 不存在也不会崩溃
  const codeText = Array.isArray(children) ? children[0]?.props?.children?.[0] ?? '' : '';

  const lines = codeText.split('\n').filter((line: string, index: number, arr: string[]) => {
    return index < arr.length - 1 || line !== '';
  });

  const handleCopy = () => {
    if (typeof codeText === 'string') {
      navigator.clipboard.writeText(codeText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="relative bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-200 rounded-lg shadow-sm my-4 text-sm font-mono">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 z-10 p-1.5 text-gray-500 bg-white/50 dark:bg-zinc-700/50 rounded-md hover:text-gray-800 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-600 transition-all"
        aria-label="Copy code to clipboard"
      >
        {isCopied ? <CheckIcon /> : <CopyIcon />}
      </button>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <tbody>
            <tr>
              <td className="p-4 pr-4 text-gray-400 dark:text-gray-500 text-right select-none align-top">
                {lines.map((_, index: number) => (
                  <div key={index}>{index + 1}</div>
                ))}
              </td>
              <td className="p-4 pl-2 text-gray-800 dark:text-white whitespace-pre align-top">
                {/* 直接渲染 children，确保内容能正确显示 */}
                <code {...props}>{children}</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
