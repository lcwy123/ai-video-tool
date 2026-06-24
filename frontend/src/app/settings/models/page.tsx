'use client';

import { useState } from 'react';

type Section = 'llm' | 'tts' | 'image' | 'video';

const sections: Record<Section, { title: string; desc: string; icon: string }> = {
  llm: { title: '语言模型 (LLM)', desc: '用于文案生成、剧本撰写', icon: '🤖' },
  tts: { title: '语音合成 (TTS)', desc: '用于配音生成', icon: '🔊' },
  image: { title: '图像生成', desc: '用于素材图片生成', icon: '🖼️' },
  video: { title: '视频生成', desc: '用于视频片段生成', icon: '🎬' },
};

export default function ModelSettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('llm');

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">模型配置</h1>
      <p className="text-sm text-gray-500 mb-6">
        配置 AI 模型的三级覆盖：默认配置 → 项目级配置 → 分镜级覆盖
      </p>

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

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {activeSection === 'llm' && (
          <div className="space-y-4">
            <h3 className="font-semibold">LLM 配置</h3>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Provider</label>
              <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                <option>openai</option><option>anthropic</option><option>ollama</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Model</label>
              <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" defaultValue="gpt-4o" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Temperature</label>
                <input type="number" step="0.1" min="0" max="2" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" defaultValue="0.7" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Max Tokens</label>
                <input type="number" step="1" min="1" max="8192" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" defaultValue="2048" />
              </div>
            </div>
          </div>
        )}
        {activeSection === 'tts' && (
          <div className="space-y-4">
            <h3 className="font-semibold">TTS 配置</h3>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Provider</label>
              <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                <option>edge_tts</option><option>openai</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">音色</label>
              <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" defaultValue="zh-CN-XiaoxiaoNeural" />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">语速</label>
              <input type="number" step="0.1" min="0.5" max="2" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" defaultValue="1.0" />
            </div>
          </div>
        )}
        {(activeSection === 'image' || activeSection === 'video') && (
          <div className="text-sm text-gray-400 text-center py-8">
            {sections[activeSection].title} 配置将在后续版本完善
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800">三级覆盖说明</h4>
        <ul className="mt-2 text-sm text-blue-700 space-y-1">
          <li><strong>1. 默认配置</strong> — 系统内置默认模型，开箱即用</li>
          <li><strong>2. 项目级配置</strong> — 在项目设置中覆盖默认</li>
          <li><strong>3. 分镜级覆盖</strong> — 在编辑器中对单个分镜修改</li>
        </ul>
      </div>
    </div>
  );
}
