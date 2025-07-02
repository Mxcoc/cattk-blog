// /app/memos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import Lightbox from './Lightbox';
import ImageGrid from './components/ImageGrid';
import CodeBlock from './components/CodeBlock';
import { Memo, User, MemoResource } from './types';

// ... (数据获取函数和图标组件未变)
const API_BASE = "https://memos.cattk.com/api/v1/memos";
const PAGE_SIZE = 10;
async function getMemos(offset = 0, limit = PAGE_SIZE): Promise<Memo[]> { /* ... */ }
const LocationIcon = () => ( <svg>...</svg> );
const TagIcon = () => ( <svg>...</svg> );
const FileIcon = () => ( <svg>...</svg> );


export default function MemosPage() {
    // ... (useState 定义部分未变)
    const user: User = { displayName: "Corey Chiu", avatarUrl: "https://avatars.githubusercontent.com/u/36592359?v=4" };
    const [memos, setMemos] = useState<Memo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
    const [gallery, setGallery] = useState<{ media: { src: string; type: string; }[]; index: number; } | null>(null);


    useEffect(() => { /* ... (初始加载 useEffect 未变) ... */ }, []);

    // 【已修改】使用更可靠的方式锁定背景滚动
    useEffect(() => {
        const scrollbarLockedClass = 'is-scrollbar-locked';
        if (gallery) {
            document.documentElement.classList.add(scrollbarLockedClass);
        } else {
            document.documentElement.classList.remove(scrollbarLockedClass);
        }
        // 组件卸载时确保移除锁定
        return () => {
            document.documentElement.classList.remove(scrollbarLockedClass);
        };
    }, [gallery]);

    // ... (其他函数 handleLoadMore, handleMediaClick 等未变)
    const handleLoadMore = async () => { /* ... */ };
    const handleMediaClick = (allMedia: MemoResource[], clickedIndex: number) => { /* ... */ };
    const closeLightbox = () => setGallery(null);
    const handleNext = () => { /* ... */ };
    const handlePrev = () => { /* ... */ };
    const markdownComponents = { pre: CodeBlock };


    return (
        <>
            <main className="container mx-auto max-w-3xl px-4 py-8">
                {/* ... (页面其他渲染部分未变，但为了完整性，提供视频渲染部分的修改) ... */}
                {/* ... */}
                 {memos.map((memo) => {
                    const allVisualMedia = (memo.resources ?? []).filter(r => r.type.startsWith('image/') || r.type.startsWith('video/'));
                    const imageResources = allVisualMedia.filter(r => r.type.startsWith('image/'));
                    const videoResources = allVisualMedia.filter(r => r.type.startsWith('video/'));
                    const fileResources = (memo.resources ?? []).filter(r => !r.type.startsWith('image/') && !r.type.startsWith('video/'));
                    const processedContent = (memo.content ?? '').replace(/#([^\s#]+)/g, '');

                    return (
                        <article key={memo.name} className="border-b border-gray-200 dark:border-zinc-700 pb-12">
                            {/* ... (头部和内容部分未变) ... */}
                            
                            <ImageGrid imageResources={imageResources} onImageClick={(index) => handleMediaClick(allVisualMedia, index)} />
                            
                            {/* 【已修改】为视频增加了 max-h-96 来优化响应式显示 */}
                            {videoResources.map((resource, index) => {
                                const overallIndex = imageResources.length + index;
                                return (
                                    <div key={resource.name} className="mt-2" onClick={() => handleMediaClick(allVisualMedia, overallIndex)}>
                                        <video src={`http://memos.cattk.com/file/${resource.name}/${resource.filename}#t=0.1`} controls playsInline preload="metadata" className="rounded-lg border dark:border-zinc-700 w-full max-h-96 cursor-pointer" />
                                    </div>
                                );
                            })}

                            {/* ... (文件和页脚部分未变) ... */}
                        </article>
                    );
                 })}
                {/* ... (加载更多按钮未变) ... */}
            </main>
            <Lightbox gallery={gallery} onClose={closeLightbox} onNext={handleNext} onPrev={handlePrev} />
        </>
    );
}

