// /app/memos/components/CodeBlock.tsx
'use client';

import { useState } from 'react';

// 复制图标
const CopyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

// "已复制" 打勾图标
const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default function CodeBlock({ children, ...props }: any) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    // children[0].props.children[0] 是从ReactMarkdown的节点结构中获取纯文本代码
    const codeText = children?.[0]?.props?.children?.[0];
    if (typeof codeText === 'string') {
      navigator.clipboard.writeText(codeText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // 2秒后恢复按钮状态
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 text-gray-400 bg-zinc-700/50 dark:bg-zinc-800/50 rounded-md hover:text-white hover:bg-zinc-600 dark:hover:bg-zinc-700 transition-all"
        aria-label="Copy code to clipboard"
      >
        {isCopied ? <CheckIcon /> : <CopyIcon />}
      </button>
      <pre {...props}>{children}</pre>
    </div>
  );
}
