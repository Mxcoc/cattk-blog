// /app/memos/Lightbox.tsx
'use client';

import { useEffect } from 'react';

interface LightboxProps {
  gallery: {
    media: { src: string; type: string; }[];
    index: number;
  } | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

// 箭头按钮组件
const NavButton = ({ onClick, direction }: { onClick: () => void; direction: 'left' | 'right' }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`absolute top-1/2 -translate-y-1/2 ${direction === 'left' ? 'left-4' : 'right-4'} w-12 h-12 bg-black/40 text-white rounded-full text-3xl flex items-center justify-center leading-none backdrop-blur-sm hover:bg-black/60 transition-all z-10`}
    aria-label={direction === 'left' ? 'Previous image' : 'Next image'}
  >
    {direction === 'left' ? '‹' : '›'}
  </button>
);


export default function Lightbox({ gallery, onClose, onNext, onPrev }: LightboxProps) {
  // 监听键盘事件
  useEffect(() => {
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
      {/* 上一张按钮 */}
      {hasMultiple && <NavButton onClick={onPrev} direction="left" />}

      <div 
        className="relative w-full h-full p-16" // 增加内边距给箭头按钮留出空间
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          <video
            key={currentResource.src} // 使用 key 来强制重新渲染
            src={currentResource.src}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={currentResource.src} // 使用 key 来强制重新渲染
            src={currentResource.src}
            alt="Enlarged view"
            onClick={onClose}
            className="w-full h-full object-contain cursor-pointer"
          />
        )}
      </div>

      {/* 下一张按钮 */}
      {hasMultiple && <NavButton onClick={onNext} direction="right" />}

      {/* 关闭按钮 */}
      <button 
        onClick={onClose}
        aria-label="Close media view"
        className="absolute top-5 right-5 w-10 h-10 bg-black/50 text-white rounded-full text-2xl flex items-center justify-center leading-none backdrop-blur-md hover:bg-white/30 transition-all"
      >
        &times;
      </button>
    </div>
  );
}
