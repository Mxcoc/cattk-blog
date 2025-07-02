// /app/memos/components/CodeBlock.tsx
'use client';

import { useState } from 'react';

const CopyIcon = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> );
const CheckIcon = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> );

export default function CodeBlock({ children, ...props }: any) {
  const [isCopied, setIsCopied] = useState(false);
  
  const codeText = children?.[0]?.props?.children?.[0] ?? '';
  
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
    // 【已修复】修改了这里的背景色和文字颜色
    <div className="relative bg-gray-100 dark:bg-zinc-800 rounded-lg shadow-sm my-4 text-sm font-mono">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 z-10 p-1.5 text-gray-500 bg-gray-200/50 dark:bg-zinc-700/50 rounded-md hover:text-gray-700 dark:hover:text-white hover:bg-gray-300/50 dark:hover:bg-zinc-600 transition-all"
        aria-label="Copy code to clipboard"
      >
        {isCopied ? <CheckIcon /> : <CopyIcon />}
      </button>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <tbody>
            <tr>
              {/* 行号列 */}
              <td className="p-4 pr-4 text-gray-400 dark:text-gray-500 text-right select-none align-top">
                {lines.map((_: string, index: number) => (
                  <div key={index}>{index + 1}</div>
                ))}
              </td>
              {/* 代码列 */}
              <td className="p-4 pl-2 text-gray-800 dark:text-white whitespace-pre align-top">
                <code {...props.children[0].props}>
                  {children[0].props.children}
                </code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
