// /app/memos/components/CodeBlock.tsx
'use client';

import { useState } from 'react';

// 辅助图标组件
const CopyIcon = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> );
const CheckIcon = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> );

export default function CodeBlock({ children, ...props }: any) {
  const [isCopied, setIsCopied] = useState(false);
  
  // 从 ReactMarkdown 的节点结构中安全地获取纯文本代码，用于复制和计算行数
  const codeText = children?.[0]?.props?.children?.[0] ?? '';
  
  // 【已修复】为 .filter() 的参数添加了明确的类型，解决部署错误
  const lines = codeText.split('\n').filter((line: string, index: number, arr: string[]) => {
    // 这个逻辑会移除代码块末尾因为换行符而产生的那个多余的空行
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
    <div className="relative bg-zinc-800 dark:bg-zinc-900 rounded-lg shadow-md my-4 text-sm font-mono">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 z-10 p-1.5 text-gray-400 bg-zinc-700/50 dark:bg-zinc-800/50 rounded-md hover:text-white hover:bg-zinc-600 dark:hover:bg-zinc-700 transition-all"
        aria-label="Copy code to clipboard"
      >
        {isCopied ? <CheckIcon /> : <CopyIcon />}
      </button>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <tbody>
            <tr>
              {/* 行号列 */}
              <td className="p-4 pr-4 text-gray-500 text-right select-none align-top">
                {lines.map((_, index) => (
                  <div key={index}>{index + 1}</div>
                ))}
              </td>
              {/* 【已修复】代码列：直接渲染 ReactMarkdown 传递过来的 children */}
              {/* 这是最稳健的方式，确保代码内容始终能正确显示 */}
              <td className="p-4 pl-2 text-white whitespace-pre align-top">
                {children}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
