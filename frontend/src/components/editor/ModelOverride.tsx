'use client';

import { useState } from 'react';

interface ModelOverrideProps {
  sceneId: string;
  onSave: (sceneId: string, overrides: Record<string, unknown>) => void;
}

export default function ModelOverride({ sceneId, onSave }: ModelOverrideProps) {
  const [expanded, setExpanded] = useState(false);
  const [llmModel, setLlmModel] = useState('');
  const [ttsVoice, setTtsVoice] = useState('');

  const handleSave = () => {
    const overrides: Record<string, unknown> = {};
    if (llmModel) overrides.llm = { provider: 'openai', model: llmModel };
    if (ttsVoice) overrides.tts = { provider: 'edge_tts', voice_id: ttsVoice };
    onSave(sceneId, overrides);
    setExpanded(false);
  };

  return (
    <div className="border-t border-gray-200 pt-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        {expanded ? '收起' : '⚙️ 模型覆盖'}
      </button>
      {expanded && (
        <div className="mt-3 space-y-3">
          <p className="text-xs text-gray-500">覆盖此分镜使用的模型（留空则使用项目级配置）</p>
          <div>
            <label className="block text-xs text-gray-500 mb-1">LLM 模型</label>
            <input value={llmModel} onChange={(e) => setLlmModel(e.target.value)}
              placeholder="例如: gpt-4o-mini"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">TTS 音色 ID</label>
            <input value={ttsVoice} onChange={(e) => setTtsVoice(e.target.value)}
              placeholder="例如: zh-CN-YunxiNeural"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <button onClick={handleSave}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700">
            应用覆盖
          </button>
        </div>
      )}
    </div>
  );
}
