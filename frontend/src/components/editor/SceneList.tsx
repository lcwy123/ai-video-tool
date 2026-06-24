'use client';

import type { Scene } from '@/lib/types';
import SceneCard from './SceneCard';

interface SceneListProps {
  scenes: Scene[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function SceneList({ scenes, activeId, onSelect, onDelete, onAdd }: SceneListProps) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-700">分镜列表</h3>
        <button
          onClick={onAdd}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + 添加
        </button>
      </div>
      {scenes.length === 0 ? (
        <p className="text-sm text-gray-400">暂无分镜，点击&ldquo;添加&rdquo;创建</p>
      ) : (
        scenes.map((scene) => (
          <SceneCard
            key={scene.id}
            id={scene.id}
            order={scene.order}
            script={scene.script}
            duration={scene.duration}
            isActive={scene.id === activeId}
            onSelect={() => onSelect(scene.id)}
            onDelete={() => onDelete(scene.id)}
          />
        ))
      )}
    </div>
  );
}
