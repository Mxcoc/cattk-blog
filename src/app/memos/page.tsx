// /app/memos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import Lightbox from './Lightbox';
import { Memo, User } from './types';
import ImageGrid from './components/ImageGrid'; // <-- 引入新的 ImageGrid 组件

// --- 数据获取函数 ---
async function getMemos(): Promise<Memo[]> {
    const apiUrl = "https://memos.cattk.com/api/v1/memos";
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
    const user: User = {
        displayName: "Corey Chiu",
        avatarUrl: "https://avatars.githubusercontent.com/u/36592359?v=4"
    };

    const [memos, setMemos] = useState<Memo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lightboxResource, setLightboxResource] = useState<{ src: string; type: string } | null>(null);

    useEffect(() => {
        async function loadMemos() { setIsLoading(true); const fetchedMemos = await getMemos(); setMemos(fetchedMemos); setIsLoading(false); }
        loadMemos();
    }, []);

    useEffect(() => {
        if (lightboxResource) { document.body.style.overflow = 'hidden'; } else { document.body.style.overflow = 'auto'; }
        return () => { document.body.style.overflow = 'auto'; };
    }, [lightboxResource]);

    const handleImageClick = (src: string) => {
        setLightboxResource({ src, type: 'image/png' }); // 假设所有从宫格点击的都是图片
    };

    const closeLightbox = () => setLightboxResource(null);

    return (
        <>
            <main className="container mx-auto max-w-3xl px-4 py-8">
                <h1 className="text-4xl font-bold mb-8 text-center">Memos</h1>
                <div className="space-y-12">
                    {isLoading ? <p className="text-center text-gray-500">正在加载备忘录...</p> : 
                     memos.map((memo) => {
                        // 将图片资源和其他资源分开
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
                                
                                {/* 【已修复】给内容容器添加 `break-words` 类确保长单词或链接能正确换行 */}
                                <div className="prose dark:prose-invert max-w-none break-words">
                                    <ReactMarkdown>{memo.content}</ReactMarkdown>
                                </div>

                                {/* 图片资源使用 ImageGrid 组件 */}
                                <ImageGrid
                                    imageResources={imageResources}
                                    onImageClick={handleImageClick}
                                />

                                {/* 其他资源（视频、文件等） */}
                                {otherResources.length > 0 && (
                                    <div className="mt-4 space-y-4">
                                        {otherResources.map(resource => {
                                            const fullSrc = `http://memos.cattk.com/file/${resource.name}/${resource.filename}`;
                                            return resource.type.startsWith('video/') ? (
                                                <div key={resource.name}>
                                                    <video src={fullSrc} controls playsInline preload="metadata" className="rounded-lg border dark:border-zinc-700 w-full" />
                                                </div>
                                            ) : (
                                                <a key={resource.name} href={fullSrc} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-gray-100 dark:bg-zinc-800 rounded-lg border dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                                                    <FileIcon /><span>{resource.filename}</span>
                                                </a>
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
                </div>
            </main>
            {lightboxResource && <Lightbox resource={lightboxResource} onClose={closeLightbox} />}
        </>
    );
}

