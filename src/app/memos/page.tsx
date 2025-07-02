// /app/memos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import Lightbox from './Lightbox';
import ImageGrid from './components/ImageGrid';
import { Memo, User } from './types';

const API_BASE = "https://memos.cattk.com/api/v1/memos";
const PAGE_SIZE = 10;

// 【已修改】数据获取函数现在支持分页
async function getMemos(offset = 0, limit = PAGE_SIZE): Promise<Memo[]> {
    const apiUrl = `${API_BASE}?limit=${limit}&offset=${offset}`;
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
const LocationIcon = () => ( <svg className="inline-block w-4 h-4 mr-1 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> );
const TagIcon = () => ( <svg className="inline-block w-4 h-4 mr-1 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg> );
const FileIcon = () => ( <svg className="w-5 h-5 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg> );

// --- 页面主组件 ---
export default function MemosPage() {
    const user: User = { displayName: "Corey Chiu", avatarUrl: "https://avatars.githubusercontent.com/u/36592359?v=4" };

    const [memos, setMemos] = useState<Memo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    // 【已新增】加载更多的状态
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
    
    // 【已修改】恢复画廊状态
    const [gallery, setGallery] = useState<{ media: { src: string; type: string; }[]; index: number; } | null>(null);

    // 初始加载
    useEffect(() => {
        async function initialLoad() {
            setIsLoading(true);
            const initialMemos = await getMemos(0);
            setMemos(initialMemos);
            setOffset(initialMemos.length);
            setHasMore(initialMemos.length === PAGE_SIZE);
            setIsLoading(false);
        }
        initialLoad();
    }, []);

    // 处理滚动条锁定
    useEffect(() => {
        if (gallery) { document.body.style.overflow = 'hidden'; } else { document.body.style.overflow = 'auto'; }
        return () => { document.body.style.overflow = 'auto'; };
    }, [gallery]);

    // 【已新增】加载更多函数
    const handleLoadMore = async () => {
        if (isLoadMoreLoading) return;
        setIsLoadMoreLoading(true);
        const newMemos = await getMemos(offset);
        if (newMemos.length > 0) {
            setMemos(prev => [...prev, ...newMemos]);
            setOffset(prev => prev + newMemos.length);
        }
        if (newMemos.length < PAGE_SIZE) {
            setHasMore(false);
        }
        setIsLoadMoreLoading(false);
    };

    // --- 画廊相关函数 ---
    const handleMediaClick = (memo: Memo, clickedIndex: number) => {
        const media = memo.resources.filter(r => r.type.startsWith('image/')).map(r => ({ src: `http://memos.cattk.com/file/${r.name}/${r.filename}`, type: r.type }));
        if (media.length > 0) setGallery({ media, index: clickedIndex });
    };
    const closeLightbox = () => setGallery(null);
    const handleNext = () => { if (gallery) setGallery(g => ({ ...g!, index: (g!.index + 1) % g!.media.length })); };
    const handlePrev = () => { if (gallery) setGallery(g => ({ ...g!, index: (g!.index - 1 + g!.media.length) % g!.media.length })); };

    return (
        <>
            <main className="container mx-auto max-w-3xl px-4 py-8">
                <h1 className="text-4xl font-bold mb-8 text-center">Memos</h1>
                <div className="space-y-12">
                    {isLoading ? <p className="text-center text-gray-500">正在加载备忘录...</p> : 
                     memos.map((memo) => {
                        const imageResources = memo.resources.filter(r => r.type.startsWith('image/'));
                        const otherResources = memo.resources.filter(r => !r.type.startsWith('image/'));

                        return (
                            <article key={memo.name} className="border-b border-gray-200 dark:border-zinc-700 pb-12">
                                <header className="flex items-center space-x-3 mb-4">
                                    <Image src={user.avatarUrl} alt={user.displayName} width={40} height={40} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold">{user.displayName}</p>
                                        <p className="text-sm text-gray-500">{new Date(memo.displayTime).toLocaleString('zh-CN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                    </div>
                                </header>
                                
                                {/* 【已修复】prose-pre:... 类精确地为代码块(pre)设置自动换行 */}
                                <div className="prose dark:prose-invert max-w-none prose-pre:whitespace-pre-wrap break-words">
                                    <ReactMarkdown>{memo.content}</ReactMarkdown>
                                </div>

                                <ImageGrid imageResources={imageResources} onImageClick={(index) => handleMediaClick(memo, index)} />

                                {otherResources.length > 0 && ( /* ... (其他资源渲染未变，为节省篇幅已折叠) ... */
                                    <div className="mt-4 space-y-4">
                                        {otherResources.map(resource => {
                                            const fullSrc = `http://memos.cattk.com/file/${resource.name}/${resource.filename}`;
                                            return resource.type.startsWith('video/') ? (
                                                <div key={resource.name}> <video src={fullSrc} controls playsInline preload="metadata" className="rounded-lg border dark:border-zinc-700 w-full" /> </div>
                                            ) : (
                                                <a key={resource.name} href={fullSrc} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-gray-100 dark:bg-zinc-800 rounded-lg border dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"> <FileIcon /><span>{resource.filename}</span> </a>
                                            );
                                        })}
                                    </div>
                                )}
                                <footer className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                                    {memo.tags && memo.tags.length > 0 && (<div className="flex items-center gap-2"><TagIcon />{memo.tags.join(', ')}</div>)}
                                    {memo.location?.placeholder && (<div className="flex items-center gap-2"><LocationIcon />{memo.location.placeholder}</div>)}
                                </footer>
                            </article>
                        );
                    })}
                    {/* 【已新增】加载更多按钮 */}
                    <div className="text-center">
                        {hasMore && (
                            <button onClick={handleLoadMore} disabled={isLoadMoreLoading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                                {isLoadMoreLoading ? '正在加载...' : '加载更多'}
                            </button>
                        )}
                        {!isLoading && !hasMore && <p className="text-gray-500">没有更多内容了</p>}
                    </div>
                </div>
            </main>
            <Lightbox gallery={gallery} onClose={closeLightbox} onNext={handleNext} onPrev={handlePrev} />
        </>
    );
}
