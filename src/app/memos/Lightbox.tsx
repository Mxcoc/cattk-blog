// /app/memos/Lightbox.tsx
'use client';

import { useEffect } from 'react';

// ... (接口定义未变)
interface LightboxProps {
  gallery: {
    media: { src: string; type: string; }[];
    index: number;
  } | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}


export default function Lightbox({ gallery, onClose, onNext, onPrev }: LightboxProps) {
  useEffect(() => {
    // ... (键盘事件监听未变)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPrev, onNext, onClose]);

  if (!gallery) return null;

  const currentResource = gallery.media[gallery.index];
  const isVideo = currentResource.type.startsWith('video/');
  const hasMultiple = gallery.media.length > 1;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* 媒体容器 */}
      <div 
        className="relative w-full h-full p-16"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          <video key={currentResource.src} src={currentResource.src} controls autoPlay className="w-full h-full object-contain" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={currentResource.src}
            src={currentResource.src}
            alt="Enlarged view"
            onClick={onClose}
            // 【已修复】调整了这里的样式类
            // 这会让图片以原始尺寸显示，但如果超出屏幕则会缩小以适应
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full w-auto h-auto object-contain cursor-pointer"
          />
        )}
      </div>

      {/* 底部导航栏 */}
      {hasMultiple && (
        <div className="fixed bottom-0 left-0 right-0 h-20 flex items-center justify-center gap-8 bg-black/30 backdrop-blur-sm">
          {/* ... (导航栏内容未变) ... */}
          <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="px-4 py-2 text-white text-lg hover:bg-white/20 rounded-md">上一张</button>
          <span className="text-white text-lg">{gallery.index + 1} / {gallery.media.length}</span>
          <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="px-4 py-2 text-white text-lg hover:bg-white/20 rounded-md">下一张</button>
        </div>
      )}

      {/* 关闭按钮 */}
      <button onClick={onClose} aria-label="Close media view" className="absolute top-5 right-5 w-10 h-10 bg-black/50 text-white rounded-full text-2xl flex items-center justify-center leading-none hover:bg-white/30 transition-all">&times;</button>
    </div>
  );
}
