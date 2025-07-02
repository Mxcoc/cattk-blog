// /app/memos/components/CodeBlock.tsx
'use client';

import { useState } from 'react';

const CopyIcon = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> );
const CheckIcon = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> );

// 【已修复】我们为 props 添加了更明确的类型，特别是 children
export default function CodeBlock({ children, ...props }: { children: React.ReactNode, [key: string]: any }) {
  const [isCopied, setIsCopied] = useState(false);
  
  // 安全地从 children 中提取纯文本
  let codeText = '';
  if (children && typeof children === 'object' && !Array.isArray(children)) {
      const childProps = (children as any).props;
      if(childProps && childProps.children && typeof childProps.children === 'string') {
        codeText = childProps.children;
      }
  } else if (Array.isArray(children)) {
      codeText = children[0]?.props?.children?.[0] ?? '';
  }

  const lines = codeText.split('\n');
  if (lines.length > 1 && lines[lines.length - 1] === '') {
    lines.pop();
  }

  const handleCopy = () => {
    if (codeText) {
      navigator.clipboard.writeText(codeText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    // 【已修改】应用了您想要的浅色主题
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
              {/* 行号列 */}
              <td className="p-4 pr-4 text-gray-400 dark:text-gray-500 text-right select-none align-top">
                {lines.map((_, index) => (
                  <div key={index}>{index + 1}</div>
                ))}
              </td>
              {/* 【已修复】恢复了最稳健的渲染方式 */}
              <td className="p-4 pl-2 whitespace-pre align-top">
                <code {...props}>{children}</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
