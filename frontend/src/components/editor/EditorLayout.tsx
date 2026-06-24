'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Scene } from '@/lib/types';
import SceneList from './SceneList';
import Timeline from './Timeline';
import SceneEditorPanel from './SceneEditor';
import AssetPanel from './AssetPanel';

interface EditorLayoutProps {
  projectId: string;
}

export default function EditorLayout({ projectId }: EditorLayoutProps) {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);
  const activeScene = scenes.find((s) => s.id === activeSceneId) || null;

  const loadScenes = useCallback(async () => {
    const data = await api.listScenes(projectId);
    setScenes(data);
    if (data.length > 0 && !activeSceneId) {
      setActiveSceneId(data[0].id);
    }
  }, [projectId, activeSceneId]);

  useEffect(() => { loadScenes(); }, [loadScenes]);

  const handleAddScene = async () => {
    await api.createScene(projectId);
    loadScenes();
  };

  const handleUpdateScene = async (id: string, data: Record<string, unknown>) => {
    await api.updateScene(id, data);
    loadScenes();
  };

  const handleDeleteScene = async (id: string) => {
    await api.deleteScene(id);
    if (activeSceneId === id) setActiveSceneId(null);
    loadScenes();
  };

  const handleReorder = async (sceneIds: string[]) => {
    await api.reorderScenes(sceneIds);
    loadScenes();
  };

  return (
    <div className="flex h-[calc(100vh-0px)]">
      {/* Left: Scene List */}
      <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
        <SceneList
          scenes={scenes}
          activeId={activeSceneId}
          onSelect={setActiveSceneId}
          onDelete={handleDeleteScene}
          onAdd={handleAddScene}
        />
      </div>

      {/* Center: Preview + Timeline */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 bg-gray-900 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p className="text-lg">3D 预览区域</p>
            <p className="text-sm mt-2">将在 Phase 3 中实现</p>
          </div>
        </div>
        <Timeline
          scenes={scenes}
          activeId={activeSceneId}
          onSelect={setActiveSceneId}
          onReorder={handleReorder}
        />
      </div>

      {/* Right: Properties Panel */}
      <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
        <SceneEditorPanel scene={activeScene} onUpdate={handleUpdateScene} />
        <div className="border-t border-gray-200">
          <AssetPanel projectId={projectId} />
        </div>
      </div>
    </div>
  );
}
