'use client';

interface SceneCardProps {
  id: string;
  order: number;
  script: string;
  duration: number;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export default function SceneCard({
  order, script, duration, isActive, onSelect, onDelete,
}: SceneCardProps) {
  return (
    <div
      className={`p-3 rounded-lg border cursor-pointer mb-2 transition-colors ${
        isActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">分镜 {order + 1}</span>
        <span className="text-xs text-gray-400">{duration}s</span>
      </div>
      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
        {script || <span className="text-gray-300">空</span>}
      </p>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="text-xs text-red-400 hover:text-red-600 mt-1"
      >
        删除
      </button>
    </div>
  );
}
