// /app/memos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import Lightbox from './Lightbox';
import ImageGrid from './components/ImageGrid';
import CodeBlock from './components/CodeBlock'; // <-- 【已新增】引入复制按钮组件
import { Memo, User } from './types';

const API_BASE = "https://memos.cattk.com/api/v1/memos";
const PAGE_SIZE = 10;

async function getMemos(offset = 0, limit = PAGE_SIZE): Promise<Memo[]> { /* ... (函数内容未变) ... */
    const apiUrl = `${API_BASE}?limit=${limit}&offset=${offset}`;
    try { const res = await fetch(apiUrl, { cache: 'no-store' }); if (!res.ok) throw new Error('Failed to fetch memos'); const data = await res.json(); return data.memos || []; } catch (error) { console.error("Error fetching memos:", error); return []; }
}

const LocationIcon = () => ( <svg className="inline-block w-4 h-4 mr-1 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> );
const TagIcon = () => ( <svg className="inline-block w-4 h-4 mr-1 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg> );
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
    const handleMediaClick = (memo: Memo, clickedIndex: number) => { /* ... (函数内容未变) ... */
        const media = memo.resources.filter(r => r.type.startsWith('image/')).map(r => ({ src: `http://memos.cattk.com/file/${r.name}/${r.filename}`, type: r.type }));
        if (media.length > 0) setGallery({ media, index: clickedIndex });
    };
    const closeLightbox = () => setGallery(null);
    const handleNext = () => { if (gallery) setGallery(g => ({ ...g!, index: (g!.index + 1) % g!.media.length })); };
    const handlePrev = () => { if (gallery) setGallery(g => ({ ...g!, index: (g!.index - 1 + g!.media.length) % g!.media.length })); };

    // 【已新增】定义Markdown自定义渲染器
    const markdownComponents = {
        // 使用新创建的 CodeBlock 组件来渲染 pre 标签
        pre: CodeBlock,
        // 自定义 a 标签的渲染，来为我们的特殊 "tag" 链接应用样式
        a: ({node, ...props}: any) => {
            if (props.href && props.href.startsWith('/tags/')) {
                return <span className="text-blue-500 dark:text-blue-400 underline decoration-dotted hover:no-underline cursor-pointer">{props.children}</span>;
            }
            // 对于所有其他普通链接，正常渲染
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
                        
                        // 【已新增】预处理内容，将 #tag 转换为我们能识别的特殊链接格式
                        const processedContent = memo.content.replace(/#([^\s#]+)/g, '[#$1](/tags/$1)');

                        return (
                            <article key={memo.name} className="border-b border-gray-200 dark:border-zinc-700 pb-12">
                                <header className="flex items-center space-x-3 mb-4">
                                    <Image src={user.avatarUrl} alt={user.displayName} width={40} height={40} className="w-10 h-10 rounded-full" />
                                    <div><p className="font-semibold">{user.displayName}</p><p className="text-sm text-gray-500">{new Date(memo.displayTime).toLocaleString('zh-CN', { dateStyle: 'medium', timeStyle: 'short' })}</p></div>
                                </header>
                                
                                <div className="prose dark:prose-invert max-w-none break-words">
                                    {/* 【已修改】使用预处理过的内容和自定义渲染器 */}
                                    <ReactMarkdown components={markdownComponents}>
                                        {processedContent}
                                    </ReactMarkdown>
                                </div>

                                <ImageGrid imageResources={imageResources} onImageClick={(index) => handleMediaClick(memo, index)} />
                                {otherResources.length > 0 && ( <div className="mt-4 space-y-4">{/* ... (其他资源渲染未变) ... */}</div> )}
                                
                                <footer className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                                    {memo.tags && memo.tags.length > 0 && (
                                        <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
                                            <TagIcon />
                                            {memo.tags.map(tag => (
                                                <span key={tag} className="text-blue-500 dark:text-blue-400 underline decoration-dotted hover:no-underline cursor-pointer">#{tag}</span>
                                            ))}
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
