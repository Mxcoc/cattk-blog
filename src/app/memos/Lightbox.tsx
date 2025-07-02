// /app/memos/Lightbox.tsx
'use client';

import { useEffect } from 'react';

interface LightboxProps {
  gallery: { media: { src: string; type: string; }[]; index: number; } | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

// 【已修复】用完整的按钮组件代码替换了占位符
const NavButton = ({ onClick, direction }: { onClick: () => void; direction: 'left' | 'right' }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className="px-4 py-2 text-white text-lg hover:bg-white/20 rounded-md"
    aria-label={direction === 'left' ? 'Previous' : 'Next'}
  >
    {direction === 'left' ? '上一张' : '下一张'}
  </button>
);

export default function Lightbox({ gallery, onClose, onNext, onPrev }: LightboxProps) {
  // 【已修复】用完整的键盘监听代码替换了占位符
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      {/* 媒体容器 */}
      <div className="relative w-full h-full p-4 sm:p-8 lg:p-16" onClick={(e) => e.stopPropagation()}>
        {isVideo ? (
          <video key={currentResource.src} src={currentResource.src} controls autoPlay className="w-full h-full object-contain" />
        ) : (
          <img key={currentResource.src} src={currentResource.src} alt="Enlarged view" onClick={onClose} className="w-full h-full object-contain cursor-pointer" />
        )}
      </div>

      {/* 底部导航栏 */}
      {hasMultiple && (
        <div className="fixed bottom-0 left-0 right-0 h-20 flex items-center justify-center gap-8 bg-black/30 backdrop-blur-sm">
          <NavButton onClick={onPrev} direction="left" />
          <span className="text-white text-lg">{gallery.index + 1} / {gallery.media.length}</span>
          <NavButton onClick={onNext} direction="right" />
        </div>
      )}

      {/* 关闭按钮 */}
      <button onClick={onClose} aria-label="Close media view" className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 bg-black/50 text-white rounded-full text-2xl flex items-center justify-center leading-none hover:bg-white/30 transition-all">&times;</button>
    </div>
  );
}
