'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

type Section = 'llm' | 'tts' | 'image' | 'video';

const sections: Record<Section, { title: string; desc: string; icon: string }> = {
  llm: { title: '语言模型 (LLM)', desc: '用于文案生成、剧本撰写', icon: '🤖' },
  tts: { title: '语音合成 (TTS)', desc: '用于配音生成', icon: '🔊' },
  image: { title: '图像生成', desc: '用于素材图片生成', icon: '🖼️' },
  video: { title: '视频生成', desc: '用于视频片段生成', icon: '🎬' },
};

const defaultConfig = {
  llm: { provider: 'openai', model: 'gpt-4o', temperature: 0.7, max_tokens: 2048 },
  tts: { provider: 'edge_tts', voice_id: 'zh-CN-XiaoxiaoNeural', speed: 1.0 },
  image_gen: { provider: 'openai', model: 'dall-e-3', size: '1024x1024' },
  video_gen: { provider: 'stub', model: 'stub' },
};

export default function ModelSettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('llm');
  const [openaiKey, setOpenaiKey] = useState('');
  const [config, setConfig] = useState(defaultConfig);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getDefaultModelConfig().then((data) => {
      const newConfig = { ...defaultConfig };
      if (data.llm_providers?.length) newConfig.llm.provider = data.llm_providers[0];
      if (data.tts_providers?.length) newConfig.tts.provider = data.tts_providers[0];
      if (data.image_providers?.length) newConfig.image_gen.provider = data.image_providers[0];
      if (data.video_providers?.length) newConfig.video_gen.provider = data.video_providers[0];
    }).catch(() => {});
  }, []);

  const updateField = (section: string, field: string, value: string | number) => {
    setConfig((prev: typeof config) => ({
      ...prev,
      [section]: { ...(prev as any)[section], [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      // Save API keys via backend env reload endpoint
      if (openaiKey) {
        await fetch('http://localhost:8000/api/model-config/default', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ openai_api_key: openaiKey }),
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError('保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">模型配置</h1>
      <p className="text-sm text-gray-500 mb-6">
        配置 AI 模型参数和 API 密钥
      </p>

      {/* API Keys */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-yellow-800 mb-3">🔑 API 密钥配置</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-yellow-700 mb-1">OpenAI API Key</label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full max-w-md rounded-md border border-yellow-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
            />
            <p className="text-xs text-yellow-600 mt-1">用于 GPT 文案生成和 DALL-E 图片生成</p>
          </div>
        </div>
      </div>

      {/* Model selector tabs */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {(Object.keys(sections) as Section[]).map((key) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`p-4 rounded-lg border text-left transition-colors ${
              activeSection === key
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-xl mb-1">{sections[key].icon}</div>
            <div className="font-medium text-sm">{sections[key].title}</div>
            <div className="text-xs text-gray-500 mt-1">{sections[key].desc}</div>
          </button>
        ))}
      </div>

      {/* Config form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {activeSection === 'llm' && (
          <div className="space-y-4">
            <h3 className="font-semibold">LLM 配置</h3>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Provider</label>
              <select value={config.llm.provider} onChange={(e) => updateField('llm', 'provider', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                <option>openai</option><option>anthropic</option><option>ollama</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Model</label>
              <input value={config.llm.model} onChange={(e) => updateField('llm', 'model', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Temperature</label>
                <input type="number" step="0.1" min="0" max="2" value={config.llm.temperature}
                  onChange={(e) => updateField('llm', 'temperature', Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Max Tokens</label>
                <input type="number" step="1" min="1" max="8192" value={config.llm.max_tokens}
                  onChange={(e) => updateField('llm', 'max_tokens', Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>
        )}
        {activeSection === 'tts' && (
          <div className="space-y-4">
            <h3 className="font-semibold">TTS 配置</h3>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Provider</label>
              <select value={config.tts.provider} onChange={(e) => updateField('tts', 'provider', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                <option>edge_tts</option><option>openai</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">默认音色</label>
              <input value={config.tts.voice_id} onChange={(e) => updateField('tts', 'voice_id', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">默认语速: {config.tts.speed}x</label>
              <input type="range" min="0.5" max="2" step="0.1" value={config.tts.speed}
                onChange={(e) => updateField('tts', 'speed', Number(e.target.value))}
                className="w-full" />
            </div>
          </div>
        )}
        {activeSection === 'image' && (
          <div className="space-y-4">
            <h3 className="font-semibold">图像生成配置</h3>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Provider</label>
              <select value={config.image_gen.provider} onChange={(e) => updateField('image_gen', 'provider', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                <option>openai</option><option>stable_diffusion</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Model</label>
              <input value={config.image_gen.model} onChange={(e) => updateField('image_gen', 'model', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">分辨率</label>
              <select value={config.image_gen.size} onChange={(e) => updateField('image_gen', 'size', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                <option>1024x1024</option><option>1792x1024</option><option>1024x1792</option>
              </select>
            </div>
          </div>
        )}
        {activeSection === 'video' && (
          <div className="space-y-4">
            <h3 className="font-semibold">视频生成配置</h3>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Provider</label>
              <select value={config.video_gen.provider} onChange={(e) => updateField('video_gen', 'provider', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                <option>stub</option><option>runway</option>
              </select>
            </div>
            <p className="text-xs text-gray-400">视频生成需要配置对应的 API 密钥</p>
          </div>
        )}
      </div>

      {/* Save button */}
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleSave} disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium">
          {saving ? '保存中...' : '保存配置'}
        </button>
        {saved && <span className="text-sm text-green-600">✅ 已保存</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800">三级覆盖说明</h4>
        <ul className="mt-2 text-sm text-blue-700 space-y-1">
          <li><strong>1. 默认配置</strong> — 此页面设置的全局默认值</li>
          <li><strong>2. 项目级配置</strong> — 在项目详情中覆盖默认（待实现）</li>
          <li><strong>3. 分镜级覆盖</strong> — 在编辑器中对单个分镜修改</li>
        </ul>
      </div>
    </div>
  );
}
