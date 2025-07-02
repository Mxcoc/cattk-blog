// /app/memos/page.tsx
'use client';

// 【已新增】从 react 导入 useRef
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import Lightbox from './Lightbox';
import ImageGrid from './components/ImageGrid';
import CodeBlock from './components/CodeBlock';
import { Memo, User, MemoResource } from './types';

const API_BASE = "https://memos.cattk.com/api/v1/memos";
const PAGE_SIZE = 10;

async function getMemos(offset = 0, limit = PAGE_SIZE): Promise<Memo[]> { /* ... (函数内容未变) ... */
    const apiUrl = `${API_BASE}?limit=${limit}&offset=${offset}`;
    try { const res = await fetch(apiUrl, { cache: 'no-store' }); if (!res.ok) throw new Error('Failed to fetch memos'); const data = await res.json(); return data.memos || []; } catch (error) { console.error("Error fetching memos:", error); return []; }
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

    // 【已新增】创建一个 ref 来存储滚动位置
    const scrollYRef = useRef(0);

    useEffect(() => { /* ... (初始加载 useEffect 未变) ... */
        async function initialLoad() { setIsLoading(true); const initialMemos = await getMemos(0); setMemos(initialMemos); setOffset(initialMemos.length); setHasMore(initialMemos.length === PAGE_SIZE); setIsLoading(false); }
        initialLoad();
    }, []);

    // 【已修改】重构了锁定滚动的 useEffect
    useEffect(() => {
        // 如果弹窗没有打开，则什么都不做
        if (!gallery) {
            return;
        }

        // 弹窗打开时：
        // 1. 记录当前的滚动位置
        scrollYRef.current = window.scrollY;
        
        // 2. 为 <html> 标签添加锁定类
        const scrollbarLockedClass = 'is-scrollbar-locked';
        document.documentElement.classList.add(scrollbarLockedClass);

        // 3. 返回一个“清理函数”
        // 这个函数会在弹窗关闭时自动执行
        return () => {
            document.documentElement.classList.remove(scrollbarLockedClass);
            // 4. 将页面滚动回之前记录的位置
            window.scrollTo(0, scrollYRef.current);
        };
    }, [gallery]); // 这个 effect 只在 gallery 状态改变时运行

    const handleLoadMore = async () => { /* ... (函数内容未变) ... */
        if (isLoadMoreLoading) return; setIsLoadMoreLoading(true); const newMemos = await getMemos(offset); if (newMemos.length > 0) { setMemos(prev => [...prev, ...newMemos]); setOffset(prev => prev + newMemos.length); } if (newMemos.length < PAGE_SIZE) { setHasMore(false); } setIsLoadMoreLoading(false);
    };

    const handleMediaClick = (allMedia: MemoResource[], clickedIndex: number) => {
        const media = allMedia.map(r => ({ src: `http://memos.cattk.com/file/${r.name}/${r.filename}`, type: r.type }));
        setGallery({ media, index: clickedIndex });
    };

    const closeLightbox = () => setGallery(null);
    const handleNext = () => { if (gallery) setGallery(g => ({ ...g!, index: (g!.index + 1) % g!.media.length })); };
    const handlePrev = () => { if (gallery) setGallery(g => ({ ...g!, index: (g!.index - 1 + g!.media.length) % g!.media.length })); };

    const markdownComponents = { pre: CodeBlock };

    return (
        <>
            <main className="container mx-auto max-w-3xl px-4 py-8">
                {/* ... (页面其他渲染部分未变) ... */}
            </main>
            <Lightbox gallery={gallery} onClose={closeLightbox} onNext={handleNext} onPrev={handlePrev} />
        </>
    );
}

