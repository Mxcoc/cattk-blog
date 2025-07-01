// /app/memos/ImageGrid.tsx
'use client';

import Image from 'next/image';
import { MemoResource } from './types';

interface ImageGridProps {
  resources: MemoResource[];
  // 修改：现在传递的是被点击媒体的索引
  onMediaClick: (index: number) => void; 
}

export default function ImageGrid({ resources, onMediaClick }: ImageGridProps) {
  const mediaResources = resources.filter(
    r => r.type.startsWith('image/') || r.type.startsWith('video/')
  );
  const count = mediaResources.length;

  if (count === 0) return null;

  const getGridClass = () => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2 || count === 4) return 'grid-cols-2';
    return 'grid-cols-3';
  };
  
  const getSingleMediaStyle = () => {
    if (count === 1) return { maxWidth: '66.66%' };
    return {};
  }

  return (
    <div className={`mt-3 grid gap-1 ${getGridClass()}`} style={getSingleMediaStyle()}>
      {mediaResources.map((resource, index) => { // <-- 增加了 index
        const fullSrc = `http://memos.cattk.com/file/${resource.name}/${resource.filename}`;
        const isVideo = resource.type.startsWith('video/');

        return (
          <div
            key={resource.name}
            className="relative aspect-square cursor-pointer bg-gray-100 dark:bg-zinc-800"
            // 修改：传递当前媒体的索引
            onClick={() => onMediaClick(index)}
          >
            {isVideo ? (
              <video
                src={`${fullSrc}#t=0.1`}
                playsInline muted loop preload="metadata"
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={`${fullSrc}?thumbnail=true`}
                alt={resource.filename}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
