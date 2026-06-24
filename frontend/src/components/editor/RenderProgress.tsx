'use client';

interface RenderProgressProps {
  status: string;
  progress: number;
  message: string;
  outputUrl?: string | null;
  onClose: () => void;
}

export default function RenderProgressBar({
  status, progress, message, outputUrl, onClose,
}: RenderProgressProps) {
  const isDone = status === 'completed';
  const isFailed = status === 'failed';

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">
          {isDone ? '渲染完成' : isFailed ? '渲染失败' : '渲染中...'}
        </span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&#x2715;</button>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all ${isFailed ? 'bg-red-500' : 'bg-blue-600'}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">{message}</p>
      {isDone && outputUrl && (
        <a
          href={`http://localhost:8000${outputUrl}`}
          download
          className="mt-2 block text-center px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          下载视频
        </a>
      )}
    </div>
  );
}
