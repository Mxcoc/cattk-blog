// /app/memos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import ImageGrid from './ImageGrid';
import Lightbox from './Lightbox';
import { Memo, User, MemoResource } from './types';

// --- 数据获取函数 ---
async function getMemos(): Promise<Memo[]> { /* ... (函数内容未变，为节省篇幅已折叠) ... */
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
const LocationIcon = () => ( <svg className="inline-block w-4 h-4 mr-1 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> );

// --- 页面主组件 ---
export default function MemosPage() {
  const user: User = {
    displayName: "Corey Chiu",
    avatarUrl: "https://avatars.githubusercontent.com/u/36592359?v=4"
  };

  const [memos, setMemos] = useState<Memo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 【已修改】Lightbox状态现在存储整个画廊信息
  const [gallery, setGallery] = useState<{ media: { src: string; type: string; }[]; index: number; } | null>(null);

  useEffect(() => { /* ... (useEffect内容未变，为节省篇幅已折叠) ... */
    async function loadMemos() {
      setIsLoading(true);
      const fetchedMemos = await getMemos();
      setMemos(fetchedMemos);
      setIsLoading(false);
    }
    loadMemos();
  }, []);

  useEffect(() => { /* ... (useEffect内容未变，为节省篇幅已折叠) ... */
    if (gallery) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [gallery]);

  // 【已修改】处理媒体点击，打开画廊
  const handleMediaClick = (memo: Memo, clickedIndex: number) => {
    const media = memo.resources
      .filter(r => r.type.startsWith('image/') || r.type.startsWith('video/'))
      .map(r => ({
        src: `http://memos.cattk.com/file/${r.name}/${r.filename}`,
        type: r.type,
      }));
    
    setGallery({ media, index: clickedIndex });
  };

  const closeLightbox = () => setGallery(null);

  const handleNext = () => {
    if (!gallery) return;
    const nextIndex = (gallery.index + 1) % gallery.media.length;
    setGallery({ ...gallery, index: nextIndex });
  };

  const handlePrev = () => {
    if (!gallery) return;
    const prevIndex = (gallery.index - 1 + gallery.media.length) % gallery.media.length;
    setGallery({ ...gallery, index: prevIndex });
  };

  return (
    <>
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Memos</h1>
        
        <div className="space-y-6">
          {isLoading ? (
            <p className="p-4 text-center text-gray-500">正在加载备忘录...</p>
          ) : memos.length > 0 ? (
            memos.map((memo) => (
              // 【已修改】恢复为卡片式UI
              <div key={memo.name} className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
                <header className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>{user.displayName}</span>
                  <span className="mx-2">·</span>
                  <time>{new Date(memo.displayTime).toLocaleString('zh-CN')}</time>
                </header>

                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                  <ReactMarkdown>{memo.content}</ReactMarkdown>
                </div>
                
                <ImageGrid 
                  resources={memo.resources} 
                  onMediaClick={(index) => handleMediaClick(memo, index)} 
                />
                
                {(memo.tags && memo.tags.length > 0 || memo.location?.placeholder) && (
                  <footer className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700 space-y-2">
                    {memo.tags && memo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-blue-600 dark:text-blue-400">
                        {memo.tags.map(tag => (
                          <span key={tag} className="underline hover:no-underline cursor-pointer">#{tag}</span>
                        ))}
                      </div>
                    )}
                    {memo.location?.placeholder && (
                      <div className="text-sm text-gray-500 flex items-center"><LocationIcon /><span>{memo.location.placeholder}</span></div>
                    )}
                  </footer>
                )}
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-gray-500">暂无内容。</p>
          )}
        </div>
      </main>
      
      <Lightbox 
        gallery={gallery} 
        onClose={closeLightbox}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </>
  );
}
