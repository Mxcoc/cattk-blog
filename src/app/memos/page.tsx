// /app/memos/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import Lightbox from './Lightbox';
import ImageGrid from './components/ImageGrid';
import CodeBlock from './components/CodeBlock';
import { Memo, User, MemoResource } from './types';

const API_BASE = "https://memos.cattk.com/api/v1/memos";
const PAGE_SIZE = 10;

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

const LocationIcon = () => ( <svg className="inline-block w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> );
const TagIcon = () => ( <svg className="inline-block w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg> );
const FileIcon = () => ( <svg className="w-5 h-5 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg> );

export default function MemosPage() {
    const user: User = { displayName: "Cattk", avatarUrl: "https://img.cattk.com/20250701/AQAD0McxG5JSIFd-.jpg" };
    const [memos, setMemos] = useState<Memo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
    const [gallery, setGallery] = useState<{ media: { src: string; type: string; }[]; index: number; } | null>(null);

    const scrollYRef = useRef(0);

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

    useEffect(() => {
        // 【已修复】这是更可靠的锁定滚动条的方法
        if (gallery) {
            scrollYRef.current = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollYRef.current}px`;
            document.body.style.width = '100%';
        } else {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollYRef.current);
        }
    }, [gallery]);

    const handleLoadMore = async () => { /* ... (函数内容未变) ... */ };
    const handleMediaClick = (allMedia: MemoResource[], clickedIndex: number) => { /* ... (函数内容未变) ... */ };
    const closeLightbox = () => setGallery(null);
    const handleNext = () => { if (gallery) setGallery(g => ({ ...g!, index: (g!.index + 1) % g!.media.length })); };
    const handlePrev = () => { if (gallery) setGallery(g => ({ ...g!, index: (g!.index - 1 + g!.media.length) % g!.media.length })); };

    const markdownComponents = { pre: CodeBlock };

    return (
        <>
            <main className="container mx-auto max-w-3xl px-4 py-8">
                <h1 className="text-4xl font-bold mb-8 text-center">Memos</h1>
                <div className="space-y-12">
                    {isLoading ? <p className="text-center text-gray-500">正在加载备忘录...</p> : 
                     memos.map((memo) => {
                        const allVisualMedia = (memo.resources ?? []).filter(r => r.type.startsWith('image/') || r.type.startsWith('video/'));
                        const imageResources = allVisualMedia.filter(r => r.type.startsWith('image/'));
                        const videoResources = allVisualMedia.filter(r => r.type.startsWith('video/'));
                        const fileResources = (memo.resources ?? []).filter(r => !r.type.startsWith('image/') && !r.type.startsWith('video/'));
                        const processedContent = (memo.content ?? '').replace(/#([^\s#]+)/g, '');

                        return (
                            <article key={memo.name} className="border-b border-gray-200 dark:border-zinc-700 pb-12">
                                {/* ... (其余渲染逻辑未变) ... */}
                            </article>
                        );
                     })}
                    <div className="text-center">
                        {hasMore && (<button onClick={handleLoadMore} disabled={isLoadMoreLoading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">{isLoadMoreLoading ? '正在加载...' : '加载更多'}</button>)}
                        {!isLoading && !hasMore && <p className="text-gray-500">没有更多内容了</p>}
                    </div>
                </div>
            </main>
            <Lightbox gallery={gallery} onClose={closeLightbox} onNext={handleNext} onPrev={handlePrev} />
        </>
    );
}
