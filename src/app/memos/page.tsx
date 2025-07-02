// /app/memos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import Lightbox from './Lightbox';
import ImageGrid from './components/ImageGrid';
import CodeBlock from './components/CodeBlock';
import { Memo, User } from './types';

const API_BASE = "https://memos.cattk.com/api/v1/memos";
const PAGE_SIZE = 10;

async function getMemos(offset = 0, limit = PAGE_SIZE): Promise<Memo[]> { /* ... (函数内容未变) ... */
    const apiUrl = `${API_BASE}?limit=${limit}&offset=${offset}`;
    try { const res = await fetch(apiUrl, { cache: 'no-store' }); if (!res.ok) throw new Error('Failed to fetch memos'); const data = await res.json(); return data.memos || []; } catch (error) { console.error("Error fetching memos:", error); return []; }
}

const LocationIcon = () => ( <svg className="inline-block w-4 h-4 mr-1 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> );
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

    useEffect(() => { /* ... (useEffect 内容未变) ... */
        async function initialLoad() { setIsLoading(true); const initialMemos = await getMemos(0); setMemos(initialMemos); setOffset(initialMemos.length); setHasMore(initialMemos.length === PAGE_SIZE); setIsLoading(false); }
        initialLoad();
    }, []);
    useEffect(() => { /* ... (useEffect 内容未变) ... */
        if (gallery) { document.body.style.overflow = 'hidden'; } else { document.body.style.overflow = 'auto'; }
        return () => { document.body.style.overflow = 'auto'; };
    }, [gallery]);
    const handleLoadMore = async () => { /* ... (函数内容未变) ... */
        if (isLoadMoreLoading) return; setIsLoadMoreLoading(true); const newMemos = await getMemos(offset); if (newMemos.length > 0) { setMemos(prev => [...prev, ...newMemos]); setOffset(prev => prev + newMemos.length); } if (newMemos.length < PAGE_SIZE) { setHasMore(false); } setIsLoadMoreLoading(false);
    };
    
    // 【已修复】让 handleMediaClick 也能处理视频
    const handleMediaClick = (memo: Memo, clickedIndex: number) => {
        const media = memo.resources
            .filter(r => r.type.startsWith('image/') || r.type.startsWith('video/'))
            .map(r => ({ src: `http://memos.cattk.com/file/${r.name}/${r.filename}`, type: r.type }));
        
        // 找到在media数组中，被点击项的正确索引
        const resource = memo.resources.filter(r => r.type.startsWith('image/') || r.type.startsWith('video/'))[clickedIndex];
        const finalIndex = media.findIndex(m => m.src.includes(resource.name));

        if (media.length > 0) setGallery({ media, index: finalIndex });
    };

    const closeLightbox = () => setGallery(null);
    const handleNext = () => { if (gallery) setGallery(g => ({ ...g!, index: (g!.index + 1) % g!.media.length })); };
    const handlePrev = () => { if (gallery) setGallery(g => ({ ...g!, index: (g!.index - 1 + g!.media.length) % g!.media.length })); };

    const markdownComponents = {
        pre: CodeBlock,
        a: ({node, ...props}: any) => {
            // 【已修复】为行内标签添加 inline-block 确保它不会错误地换行
            if (props.href && props.href.startsWith('/tags/')) {
                return <span className="text-blue-500 dark:text-blue-400 underline decoration-dotted hover:no-underline cursor-pointer inline-block">{props.children}</span>;
            }
            return <a href={props.href} target="_blank" rel="noopener noreferrer">{props.children}</a>;
        }
    };

    return (
        <>
            <main className="container mx-auto max-w-3xl px-4 py-8">
                <h1 className="text-4xl font-bold mb-8 text-center">Memos</h1>
                <div className="space-y-12">
                    {isLoading ? <p className="text-center text-gray-500">正在加载备忘录...</p> : 
                     memos.map((memo) => {
                        const imageResources = memo.resources.filter(r => r.type.startsWith('image/'));
                        const otherResources = memo.resources.filter(r => !r.type.startsWith('image/'));
                        const processedContent = memo.content.replace(/#([^\s#]+)/g, '[#$1](/tags/$1)');

                        return (
                            <article key={memo.name} className="border-b border-gray-200 dark:border-zinc-700 pb-12">
                                <header className="flex items-center space-x-3 mb-4"> {/* ... (头部内容未变) ... */ <Image src={user.avatarUrl} alt={user.displayName} width={40} height={40} className="w-10 h-10 rounded-full" /><div><p className="font-semibold">{user.displayName}</p><p className="text-sm text-gray-500">{new Date(memo.displayTime).toLocaleString('zh-CN', { dateStyle: 'medium', timeStyle: 'short' })}</p></div>} </header>
                                
                                {/* 【已修复】在 prose 容器上添加 overflow-hidden 配合 break-words 确保内容被强制截断换行 */}
                                <div className="prose dark:prose-invert max-w-none break-words overflow-hidden">
                                    <ReactMarkdown components={markdownComponents}>{processedContent}</ReactMarkdown>
                                </div>

                                <ImageGrid imageResources={imageResources} onImageClick={(index) => handleMediaClick(memo, index)} />

                                {otherResources.length > 0 && (
                                    <div className="mt-4 space-y-4">
                                        {otherResources.map((resource, index) => {
                                            const fullSrc = `http://memos.cattk.com/file/${resource.name}/${resource.filename}`;
                                            return resource.type.startsWith('video/') ? (
                                                // 【已修复】为视频添加 #t=0.1 以帮助加载预览图，并使其可点击放大
                                                <div key={resource.name} className="cursor-pointer" onClick={() => handleMediaClick(memo, imageResources.length + index)}>
                                                    <video src={`${fullSrc}#t=0.1`} controls playsInline preload="metadata" className="rounded-lg border dark:border-zinc-700 w-full" />
                                                </div>
                                            ) : (
                                                <a key={resource.name} href={fullSrc} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-gray-100 dark:bg-zinc-800 rounded-lg border dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"> <FileIcon /><span>{resource.filename}</span> </a>
                                            );
                                        })}
                                    </div>
                                )}
                                <footer className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                                    {memo.tags && memo.tags.length > 0 && (
                                        // 【已修复】调整了图标和文本的间距
                                        <div className="flex items-center gap-2">
                                            <TagIcon />
                                            <div className="flex flex-wrap gap-x-3 gap-y-1">
                                                {memo.tags.map(tag => (<span key={tag} className="text-blue-500 dark:text-blue-400 underline decoration-dotted hover:no-underline cursor-pointer">#{tag}</span>))}
                                            </div>
                                        </div>
                                    )}
                                    {memo.location?.placeholder && (<div className="flex items-center gap-2"><LocationIcon />{memo.location.placeholder}</div>)}
                                </footer>
                            </article>
                        );
                    })}
                    <div className="text-center"> {/* ... (加载更多按钮未变) ... */}
                        {hasMore && (<button onClick={handleLoadMore} disabled={isLoadMoreLoading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">{isLoadMoreLoading ? '正在加载...' : '加载更多'}</button>)}
                        {!isLoading && !hasMore && <p className="text-gray-500">没有更多内容了</p>}
                    </div>
                </div>
            </main>
            <Lightbox gallery={gallery} onClose={closeLightbox} onNext={handleNext} onPrev={handlePrev} />
        </>
    );
}
