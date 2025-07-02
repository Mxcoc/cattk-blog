// /app/memos/components/CodeBlock.tsx
'use client';

import { useState } from 'react';

// 辅助图标组件
const CopyIcon = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> );
const CheckIcon = () => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> );

export default function CodeBlock({ children, ...props }: any) {
  const [isCopied, setIsCopied] = useState(false);
  
  // 从 ReactMarkdown 的节点结构中安全地获取纯文本代码
  const codeText = children?.[0]?.props?.children?.[0] ?? '';

  const handleCopy = () => {
    if (typeof codeText === 'string') {
      navigator.clipboard.writeText(codeText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    // 使用相对定位的容器，为复制按钮提供定位锚点
    <div className="relative my-4">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 z-10 p-1.5 text-gray-400 bg-zinc-700/50 dark:bg-zinc-800/50 rounded-md hover:text-white hover:bg-zinc-600 dark:hover:bg-zinc-700 transition-all"
        aria-label="Copy code to clipboard"
      >
        {isCopied ? <CheckIcon /> : <CopyIcon />}
      </button>

      {/* 直接渲染 ReactMarkdown 传递过来的 <pre> 标签的子元素 (即 <code>) */}
      {/* 这种方式最稳健，确保内容始终能正确显示 */}
      <pre className="bg-zinc-800 dark:bg-zinc-900 rounded-lg shadow-md p-4 overflow-x-auto" {...props}>
        {children}
      </pre>
    </div>
  );
}
