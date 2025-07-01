// /app/memos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

import Lightbox from './Lightbox';
import ImageGrid from './ImageGrid';
import { Memo, User } from './types';

// --- 数据获取函数 ---
async function getMemos(): Promise<Memo[]> {
  const apiUrl = "https://memos.cattk.com/api/v1/memos?limit=15";
  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch memos');
    const data = await res.json();
    return data.memos || [];
  } catch (error) {
    console.error("Error fetching memos:", error);
    return [];
  }
}

// --- 辅助图标 ---
const LocationIcon = () => ( <svg className="inline-block w-4 h-4 mr-1 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> );
const FallbackAvatar = () => ( <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center"><svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg></div> );

// --- 页面主组件 ---
export default function MemosPage() {
  const user: User = {
    displayName: "Corey Chiu",
    avatarUrl: "https://avatars.githubusercontent.com/u/36592359?v=4"
  };

  const [memos, setMemos] = useState<Memo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxResource, setLightboxResource] = useState<{ src: string; type: string } | null>(null);

  useEffect(() => {
    async function loadMemos() {
      setIsLoading(true);
      const fetchedMemos = await getMemos();
      setMemos(fetchedMemos);
      setIsLoading(false);
    }
    loadMemos();
  }, []);

  // 【已修改】新增 useEffect 来处理页面滚动条
  useEffect(() => {
    // 当 lightbox 打开时
    if (lightboxResource) {
      // 禁止 body 滚动
      document.body.style.overflow = 'hidden';
    } else {
      // 当 lightbox 关闭时，恢复 body 滚动
      document.body.style.overflow = 'auto';
    }

    // 组件卸载时，确保滚动条恢复正常，这是一个好的实践
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [lightboxResource]); // 这个 effect 依赖于 lightboxResource 的状态变化

  const handleMediaClick = (resource: { src: string; type: string }) => {
    setLightboxResource(resource);
  };

  const closeLightbox = () => {
    setLightboxResource(null);
  };

  return (
    <>
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Memos</h1>
        
        <div>
          {isLoading ? (
            <p className="p-4 text-center text-gray-500">正在加载备忘录...</p>
          ) : memos.length > 0 ? (
            memos.map((memo) => (
              <article key={memo.name} className="flex gap-4 p-4 border-b border-gray-200 dark:border-zinc-700">
                <div className="flex-shrink-0">
                  {user.avatarUrl ? <Image src={user.avatarUrl} alt={user.displayName} width={48} height={48} className="w-12 h-12 rounded-full" /> : <FallbackAvatar />}
                </div>
                <div className="flex-1 overflow-hidden">
                  <header className="flex items-center gap-2 mb-1">
                    <span className="font-bold hover:underline">{user.displayName}</span>
                    <span className="text-gray-500 text-sm">· {new Date(memo.displayTime).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
                  </header>
                  
                  <div className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                    <ReactMarkdown>{memo.content}</ReactMarkdown>
                  </div>
                  
                  <ImageGrid resources={memo.resources} onMediaClick={handleMediaClick} />
                  
                  {memo.tags && memo.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-blue-600 dark:text-blue-400">
                      {memo.tags.map(tag => (
                        <span key={tag} className="underline hover:no-underline cursor-pointer">#{tag}</span>
                      ))}
                    </div>
                  )}

                  {memo.location?.placeholder && (
                    <div className="mt-3 text-sm text-gray-500 flex items-center"><LocationIcon /><span>{memo.location.placeholder}</span></div>
                  )}
                </div>
              </article>
            ))
          ) : (
            <p className="p-4 text-center text-gray-500">暂无内容。</p>
          )}
        </div>
      </main>
      
      {lightboxResource && <Lightbox resource={lightboxResource} onClose={closeLightbox} />}
    </>
  );
}
