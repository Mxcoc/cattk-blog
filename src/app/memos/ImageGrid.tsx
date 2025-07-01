// /app/memos/ImageGrid.tsx
'use client';

import Image from 'next/image';
import { MemoResource } from './types';

interface ImageGridProps {
  resources: MemoResource[];
  onMediaClick: (resource: { src: string; type: string }) => void;
}

export default function ImageGrid({ resources, onMediaClick }: ImageGridProps) {
  // 同时支持图片和视频
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
      {mediaResources.map(resource => {
        const fullSrc = `http://memos.cattk.com/file/${resource.name}/${resource.filename}`;
        const isVideo = resource.type.startsWith('video/');

        return (
          <div
            key={resource.name}
            className="relative aspect-square cursor-pointer bg-gray-100 dark:bg-zinc-800"
            onClick={() => onMediaClick({ src: fullSrc, type: resource.type })}
          >
            {isVideo ? (
              <video
                src={`${fullSrc}#t=0.1`} // `#t=0.1` 用于在移动端显示视频第一帧
                playsInline
                muted
                loop
                preload="metadata"
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
