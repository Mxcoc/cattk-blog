// /app/memos/components/CodeBlock.tsx
'use client';

import { useState } from 'react';

const CopyIcon = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> );
const CheckIcon = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> );

export default function CodeBlock({ children, ...props }: any) {
  const [isCopied, setIsCopied] = useState(false);
  
  // 从 ReactMarkdown 的节点结构中获取纯文本代码
  const codeText = children?.[0]?.props?.children?.[0] ?? '';
  
  // 计算行数
  const lineCount = codeText.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1).join('\n');

  const handleCopy = () => {
    if (typeof codeText === 'string') {
      navigator.clipboard.writeText(codeText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="relative bg-zinc-800 dark:bg-zinc-900 rounded-lg shadow-md my-4">
      {/* 复制按钮 */}
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 z-10 p-1.5 text-gray-400 bg-zinc-700/50 dark:bg-zinc-800/50 rounded-md hover:text-white hover:bg-zinc-600 dark:hover:bg-zinc-700 transition-all"
        aria-label="Copy code to clipboard"
      >
        {isCopied ? <CheckIcon /> : <CopyIcon />}
      </button>

      {/* 【已修复】使用更稳健的方式渲染代码和行号 */}
      <div className="flex overflow-x-auto">
        {/* 行号 */}
        <pre className="p-4 text-right text-gray-500 select-none">
          <code>{lineNumbers}</code>
        </pre>
        {/* 原始代码 */}
        <pre className="p-4 flex-1">
          {children}
        </pre>
      </div>
    </div>
  );
}

