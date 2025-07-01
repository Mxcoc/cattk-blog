// /app/memos/Lightbox.tsx
'use client';

interface LightboxProps {
  resource: {
    src: string;
    type: string;
  } | null;
  onClose: () => void;
}

export default function Lightbox({ resource, onClose }: LightboxProps) {
  if (!resource) return null;

  const isVideo = resource.type.startsWith('video/');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose} // 点击背景关闭
    >
      <div 
        className="relative w-full h-full p-4"
        // 点击图片或视频的容器区域时，阻止事件冒泡到背景上，避免意外关闭
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          <video
            src={resource.src}
            controls
            autoPlay
            // 点击视频时不会关闭，以便用户可以操作控制条
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full rounded-lg"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resource.src}
            alt="Enlarged view"
            // 【已修改】新增onClick事件，现在单击图片本身也会关闭预览
            onClick={onClose}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full w-auto h-auto object-contain rounded-lg cursor-pointer"
          />
        )}
        <button 
          onClick={onClose}
          aria-label="Close media view"
          className="absolute top-5 right-5 w-10 h-10 bg-black/50 text-white rounded-full text-2xl flex items-center justify-center leading-none backdrop-blur-md hover:bg-white/30 transition-all"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

