// /app/memos/components/ImageGrid.tsx
'use client';

import Image from 'next/image';

// 定义这个组件接收的属性类型
interface ImageGridProps {
  // 只接收图片资源
  imageResources: { name: string; filename: string; }[]; 
  // 点击图片时要执行的函数
  onImageClick: (src: string) => void;
}

export default function ImageGrid({ imageResources, onImageClick }: ImageGridProps) {
  const count = imageResources.length;

  // 如果没有图片，不渲染任何东西
  if (count === 0) return null;

  // 根据图片数量返回不同的CSS Grid布局类
  const getGridClass = () => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2 || count === 4) return 'grid-cols-2';
    return 'grid-cols-3';
  };
  
  // 单张图片时，限制最大宽度
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
          <div key={resource.name} className="relative aspect-square">
            <Image
              src={thumbSrc}
              alt={resource.filename}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover cursor-pointer rounded-lg hover:opacity-90 transition-opacity"
              onClick={() => onImageClick(fullSrc)}
            />
          </div>
        );
      })}
    </div>
  );
}
