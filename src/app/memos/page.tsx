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
        if (!res.ok) {
            console.error('Failed to fetch memos:', res.statusText);
            return [];
        }
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
    const user: User = { displayName: "Corey Chiu", avatarUrl: "https://avatars.githubusercontent.com/u/36592359?v=4" };
    const [memos, setMemos] = useState<Memo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
    const [gallery, setGallery] = useState<{ media: { src: string; type: string; }[]; index: number; } | null>(null);

    const scrollYRef = useRef(0);

    // 【已加固】确保只在浏览器环境中执行数据获取
    useEffect(() => {
        async function initialLoad() {
            setIsLoading(true);
            const initialMemos = await getMemos(0);
            setMemos(initialMemos);
            setOffset(initialMemos.length);
            setHasMore(initialMemos.length === PAGE_SIZE);
            setIsLoading(false);
        }
        if (typeof window !== 'undefined') {
            initialLoad();
        }
    }, []);

    // 【已加固】确保只在浏览器环境中操作 document 对象
    useEffect(() => {
        // 如果不是在浏览器环境，或者弹窗没打开，直接返回
        if (typeof window === 'undefined' || !gallery) {
            return;
        }

        const scrollY = window.scrollY;
        const scrollbarLockedClass = 'is-scrollbar-locked';
        
        document.documentElement.classList.add(scrollbarLockedClass);

        return () => {
            document.documentElement.classList.remove(scrollbarLockedClass);
            window.scrollTo(0, scrollY);
        };
    }, [gallery]);

    const handleLoadMore = async () => { /* ... (函数内容未变) ... */ };
    const handleMediaClick = (allMedia: MemoResource[], clickedIndex: number) => { /* ... (函数内容未变) ... */ };
    const closeLightbox = () => setGallery(null);
    const handleNext = () => { if (gallery) setGallery(g => ({ ...g!, index: (g!.index + 1) % g!.media.length })); };
    const handlePrev = () => { if (gallery) setGallery(g => ({ ...g!, index: (g!.index - 1 + g!.media.length) % g!.media.length })); };

    const markdownComponents = { pre: CodeBlock };

    // 【已加固】在渲染任何内容前，增加一个顶级安全检查
    if (typeof window === 'undefined') {
        return null; // 在服务器端渲染或构建时，不渲染任何东西，避免潜在错误
    }

    return (
        <>
            <main className="container mx-auto max-w-3xl px-4 py-8">
                <h1 className="text-4xl font-bold mb-8 text-center">Memos</h1>
                <div className="space-y-12">
                    {/* ... (其余渲染逻辑未变，但现在它们被上面的安全检查保护) ... */}
                </div>
            </main>
            <Lightbox gallery={gallery} onClose={closeLightbox} onNext={handleNext} onPrev={handlePrev} />
        </>
    );
}

