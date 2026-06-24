'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

interface AIGeneratorProps {
  projectId: string;
  type: 'image' | 'video';
  onGenerated: () => void;
}

export default function AIGenerator({ projectId, type, onGenerated }: AIGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError(null);
    setResult(null);
    try {
      if (type === 'image') {
        const asset = await api.generateImage(projectId, prompt);
        setResult(`图片已生成: ${asset.file_name}`);
      } else {
        const asset = await api.generateVideo(projectId, prompt);
        setResult(`视频已生成: ${asset.file_name}`);
      }
      onGenerated();
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败（可能需要配置 API Key）');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">
        AI 生成{type === 'image' ? '图片' : '视频'}
      </h4>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={`描述你想生成的${type === 'image' ? '图片' : '视频'}...`}
        rows={2}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
      <button
        onClick={handleGenerate}
        disabled={generating || !prompt.trim()}
        className="mt-2 px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
      >
        {generating ? '生成中...' : `✨ 生成${type === 'image' ? '图片' : '视频'}`}
      </button>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {result && <p className="mt-1 text-xs text-green-600">{result}</p>}
    </div>
  );
}
