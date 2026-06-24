'use client';

import { useState, FormEvent } from 'react';

interface AvatarFormProps {
  initial?: { name: string; personality: string; avatarStyle: string };
  onSubmit: (data: { name: string; personality: string; avatar_style: string }) => Promise<void>;
}

export default function AvatarForm({ initial, onSubmit }: AvatarFormProps) {
  const [name, setName] = useState(initial?.name || '');
  const [personality, setPersonality] = useState(initial?.personality || '');
  const [avatarStyle, setAvatarStyle] = useState(initial?.avatarStyle || '写实');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), personality, avatar_style: avatarStyle });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700">角色名称</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">风格</label>
        <select
          value={avatarStyle}
          onChange={(e) => setAvatarStyle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
        >
          <option>写实</option>
          <option>卡通</option>
          <option>二次元</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">角色人设（提示词）</label>
        <textarea
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
          placeholder="设定角色的性格、语气、说话风格..."
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? '提交中...' : initial ? '保存修改' : '创建角色'}
      </button>
    </form>
  );
}
