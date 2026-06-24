'use client';

import type { Scene } from '@/lib/types';

interface TimelineProps {
  scenes: Scene[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onReorder: (sceneIds: string[]) => void;
}

export default function Timeline({ scenes, activeId, onSelect, onReorder }: TimelineProps) {
  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const fromIndex = Number(e.dataTransfer.getData('text/plain'));
    if (fromIndex === targetIndex) return;
    const reordered = [...scenes];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    onReorder(reordered.map((s) => s.id));
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-center gap-1 mb-2">
        <span className="text-xs text-gray-400 w-12">时间线</span>
        <span className="text-xs text-gray-400">{totalDuration}s</span>
      </div>
      <div className="flex gap-1 overflow-x-auto pb-2" style={{ minHeight: 48 }}>
        {scenes.map((scene, index) => {
          const width = Math.max((scene.duration / Math.max(totalDuration, 1)) * 100, 8);
          return (
            <div
              key={scene.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, index)}
              onClick={() => onSelect(scene.id)}
              className={`flex-shrink-0 rounded cursor-pointer transition-colors ${
                scene.id === activeId ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              style={{ width: `${width}%`, minWidth: 40, height: 32 }}
              title={`分镜 ${index + 1}: ${scene.script?.slice(0, 30) || '空'}`}
            >
              <div className="text-[10px] text-white px-1 truncate">
                {index + 1}
              </div>
            </div>
          );
        })}
        {scenes.length === 0 && (
          <div className="text-sm text-gray-300 flex items-center">暂无分镜</div>
        )}
      </div>
    </div>
  );
}
