'use client';

import { useRef, useState } from 'react';

interface VideoPlayerProps {
  src?: string | null;
}

export default function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); }
    else { videoRef.current.play(); }
    setPlaying(!playing);
  };

  if (!src) {
    return (
      <div className="flex-1 bg-gray-900 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg">3D 预览区域</p>
          <p className="text-sm mt-2">导出视频后将在此显示预览</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-black relative flex items-center justify-center">
      <video ref={videoRef} src={src} className="max-w-full max-h-full" onClick={togglePlay} onEnded={() => setPlaying(false)} />
      {!playing && (
        <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}
