// /app/memos/Lightbox.tsx
'use client';

import Image from 'next/image';

interface LightboxProps {
  src: string;
  onClose: () => void;
}

export default function Lightbox({ src, onClose }: LightboxProps) {
  if (!src) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Enlarged view"
          className="max-w-full max-h-full object-contain"
        />
        <button 
          onClick={onClose}
          className="absolute -top-2 -right-2 w-8 h-8 bg-white text-black rounded-full text-xl leading-none"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
