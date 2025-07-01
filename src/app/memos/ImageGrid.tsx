// /app/memos/ImageGrid.tsx
'use client';

import Image from 'next/image';
import { MemoResource } from './types'; // 我们将把类型定义移到一个单独的文件中

interface ImageGridProps {
  resources: MemoResource[];
  onImageClick: (src: string) => void;
}

export default function ImageGrid({ resources, onImageClick }: ImageGridProps) {
  const imageResources = resources.filter(r => r.type.startsWith('image/'));
  const count = imageResources.length;

  if (count === 0) return null;

  const getGridClass = () => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2 || count === 4) return 'grid-cols-2';
    return 'grid-cols-3';
  };
  
  const getSingleImageStyle = () => {
      if (count === 1) return { maxWidth: '66.66%' };
      return {};
  }

  return (
    <div className={`mt-3 grid gap-1 ${getGridClass()}`} style={getSingleImageStyle()}>
      {imageResources.map(resource => {
        const fullSrc = `http://memos.cattk.com/file/${resource.name}/${resource.filename}`;
        const thumbSrc = `${fullSrc}?thumbnail=true`;

        return (
          <div
            key={resource.name}
            className="relative aspect-square cursor-pointer bg-gray-100 dark:bg-zinc-800"
            onClick={() => onImageClick(fullSrc)}
          >
            <Image
              src={thumbSrc}
              alt={resource.filename}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}
