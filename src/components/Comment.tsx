'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import twikoo from 'twikoo';

/**
 * Twikoo 评论组件
 * 使用 useEffect 和 useRef 来安全地在 Next.js 中初始化 Twikoo，并处理主题切换。
 */
const Comment = () => {
  // 从 next-themes 获取实际渲染的主题 (light 或 dark)
  const { resolvedTheme } = useTheme();
  // 创建一个 ref 来引用评论的容器 div
  const commentContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 确保 DOM 元素已挂载，且容器内没有子节点 (防止重复初始化)
    if (commentContainerRef.current && !commentContainerRef.current.hasChildNodes()) {
      twikoo.init({
        // 从环境变量读取您的 Twikoo 后端地址
        envId: process.env.NEXT_PUBLIC_TWIKOO_ENV_ID!,
        // 指定挂载的 DOM 元素
        el: commentContainerRef.current,
        // 根据网站的实际主题设置 Twikoo 的主题
        theme: resolvedTheme,
      }).catch(error => {
        console.error('Twikoo 初始化失败:', error);
      });
    }
  }, [resolvedTheme]); // 当网站主题变化时，重新运行此 effect 来更新 Twikoo 的主题

  // 如果未配置 envId，则不渲染任何内容，避免前端报错
  if (!process.env.NEXT_PUBLIC_TWIKOO_ENV_ID) {
    return null;
  }

  // 创建一个 div 作为 Twikoo 的挂载点
  return <div ref={commentContainerRef} className="mt-16" />;
};

export default Comment;
