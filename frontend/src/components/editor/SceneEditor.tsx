'use client';

import { useState, useEffect } from 'react';
import type { Scene } from '@/lib/types';

interface SceneEditorProps {
  scene: Scene | null;
  onUpdate: (id: string, data: Record<string, unknown>) => void;
}

export default function SceneEditorPanel({ scene, onUpdate }: SceneEditorProps) {
  const [script, setScript] = useState('');
  const [duration, setDuration] = useState(10);
  const [avatarAction, setAvatarAction] = useState('');

  useEffect(() => {
    if (scene) {
      setScript(scene.script);
      setDuration(scene.duration);
      setAvatarAction(scene.avatar_action || '');
    }
  }, [scene]);

  if (!scene) {
    return (
      <div className="p-4 text-sm text-gray-400">
        选择一个分镜开始编辑
      </div>
    );
  }

  const handleBlur = () => {
    const updates: Record<string, unknown> = {};
    if (script !== scene.script) updates.script = script;
    if (duration !== scene.duration) updates.duration = duration;
    if (avatarAction !== (scene.avatar_action || '')) updates.avatar_action = avatarAction;
    if (Object.keys(updates).length > 0) {
      onUpdate(scene.id, updates);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-medium text-gray-700">分镜属性</h3>
      <div>
        <label className="block text-sm text-gray-500 mb-1">文案</label>
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          onBlur={handleBlur}
          rows={6}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="输入分镜文案..."
        />
      </div>
      <div>
        <label className="block text-sm text-gray-500 mb-1">时长（秒）</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          onBlur={handleBlur}
          min={1}
          max={300}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-500 mb-1">角色动作描述</label>
        <input
          value={avatarAction}
          onChange={(e) => setAvatarAction(e.target.value)}
          onBlur={handleBlur}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="例如：微笑着面向镜头"
        />
      </div>
      <div className="text-xs text-gray-400">
        配音和背景素材将在后续面板中配置
      </div>
    </div>
  );
}
