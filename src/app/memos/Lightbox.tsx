// /app/memos/Lightbox.tsx
'use client';

interface LightboxProps {
  src: string;
  onClose: () => void;
}

export default function Lightbox({ src, onClose }: LightboxProps) {
  if (!src) return null;

  return (
    // 1. 创建一个带黑色半透明背景和模糊效果的固定浮层
    // 点击背景本身即可关闭图片
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* 2. 图片容器，它会占据浮层的绝大部分空间 */}
      {/* 使用 p-4 (padding) 来确保在任何屏幕上都有一个安全边距 */}
      <div 
        className="relative w-full h-full p-4"
        // 点击图片本身时，阻止事件冒泡到背景上，避免关闭
        onClick={(e) => e.stopPropagation()}
      >
        {/* 3. 图片元素 */}
        {/* 使用绝对定位和transform进行完美居中 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Enlarged view"
          className="
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            max-w-full max-h-full w-auto h-auto object-contain
            rounded-lg
          "
        />

        {/* 4. 关闭按钮 */}
        {/* 定位在视口的右上角，并美化了样式 */}
        <button 
          onClick={onClose}
          aria-label="Close image view"
          className="
            absolute top-5 right-5 w-10 h-10 
            bg-black/50 text-white rounded-full text-2xl 
            flex items-center justify-center
            leading-none backdrop-blur-md 
            hover:bg-white/30 transition-all
          "
        >
          &times;
        </button>
      </div>
    </div>
  );
}
