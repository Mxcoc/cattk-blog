// /app/memos/Lightbox.tsx
'use client';

import { useEffect } from 'react';

interface LightboxProps {
  gallery: { media: { src: string; type: string; }[]; index: number; } | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const NavButton = ({ onClick, direction }: { onClick: () => void; direction: 'left' | 'right' }) => ( /* ... (组件未变) ... */ );

export default function Lightbox({ gallery, onClose, onNext, onPrev }: LightboxProps) {
  useEffect(() => { /* ... (键盘事件监听未变) ... */ }, [onPrev, onNext, onClose]);

  if (!gallery) return null;

  const currentResource = gallery.media[gallery.index];
  const isVideo = currentResource.type.startsWith('video/');
  const hasMultiple = gallery.media.length > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      {/* 【已修改】将 p-16 改为响应式边距 p-4 sm:p-8 lg:p-16 */}
      <div className="relative w-full h-full p-4 sm:p-8 lg:p-16" onClick={(e) => e.stopPropagation()}>
        {isVideo ? (
          <video key={currentResource.src} src={currentResource.src} controls autoPlay className="w-full h-full object-contain" />
        ) : (
          <img key={currentResource.src} src={currentResource.src} alt="Enlarged view" onClick={onClose} className="w-full h-full object-contain cursor-pointer" />
        )}
      </div>

      {hasMultiple && ( /* ... (底部导航栏未变) ... */ )}
      <button onClick={onClose} aria-label="Close media view" className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 bg-black/50 text-white rounded-full text-2xl flex items-center justify-center leading-none hover:bg-white/30 transition-all">&times;</button>
    </div>
  );
}
