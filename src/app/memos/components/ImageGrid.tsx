// /app/memos/components/ImageGrid.tsx
'use client';

import Image from 'next/image';

interface ImageGridProps {
  imageResources: { name: string; filename: string; }[];
  onImageClick: (index: number) => void;
}

export default function ImageGrid({ imageResources, onImageClick }: ImageGridProps) {
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
      {imageResources.map((resource, index) => {
        const fullSrc = `http://memos.cattk.com/file/${resource.name}/${resource.filename}`;
        return (
          <div key={resource.name} className="relative aspect-square">
            <Image
              src={`${fullSrc}?thumbnail=true`}
              alt={resource.filename}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover cursor-pointer rounded-lg hover:opacity-90 transition-opacity"
              onClick={() => onImageClick(index)}
            />
          </div>
        );
      })}
    </div>
  );
}
