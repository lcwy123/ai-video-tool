'use client';

import { useState } from 'react';
import type { VoicePreset } from '@/lib/types';
import { api } from '@/lib/api';

interface VoiceConfigProps {
  avatarId: string;
  initial?: VoicePreset | null;
  onSave: (preset: VoicePreset) => void;
}

const TTS_VOICES = [
  { id: 'zh-CN-XiaoxiaoNeural', label: '晓晓（女声）' },
  { id: 'zh-CN-YunxiNeural', label: '云希（男声）' },
  { id: 'zh-CN-XiaoyiNeural', label: '晓伊（女声）' },
  { id: 'zh-CN-YunyangNeural', label: '云扬（男声）' },
  { id: 'en-US-AriaNeural', label: 'Aria (English)' },
];

export default function VoiceConfig({ avatarId, initial, onSave }: VoiceConfigProps) {
  const [voiceId, setVoiceId] = useState(initial?.voice_id || 'zh-CN-XiaoxiaoNeural');
  const [speed, setSpeed] = useState(initial?.speed || 1.0);
  const [saving, setSaving] = useState(false);
  const [testText, setTestText] = useState('你好，欢迎观看我的视频。');

  const handleSave = async () => {
    setSaving(true);
    try {
      const preset: VoicePreset = { provider: 'edge_tts', voice_id: voiceId, speed, pitch: 1.0 };
      await api.updateAvatar(avatarId, { voice_preset: preset });
      onSave(preset);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">声音配置</h3>
      <div>
        <label className="block text-sm text-gray-500 mb-1">音色</label>
        <select
          value={voiceId}
          onChange={(e) => setVoiceId(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          {TTS_VOICES.map((v) => (
            <option key={v.id} value={v.id}>{v.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-500 mb-1">语速: {speed.toFixed(1)}x</label>
        <input
          type="range" min={0.5} max={2} step={0.1}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-500 mb-1">试听文本</label>
        <input
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
      >
        {saving ? '保存中...' : '保存声音设置'}
      </button>
    </div>
  );
}
