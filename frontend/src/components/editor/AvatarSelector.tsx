'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Avatar } from '@/lib/types';

interface AvatarSelectorProps {
  selectedId: string | null;
  onSelect: (avatar: Avatar | null) => void;
}

export default function AvatarSelector({ selectedId, onSelect }: AvatarSelectorProps) {
  const [avatars, setAvatars] = useState<Avatar[]>([]);

  useEffect(() => {
    api.listAvatars().then(setAvatars).catch(() => {});
  }, []);

  return (
    <div className="p-4 border-b border-gray-200">
      <label className="block text-sm font-medium text-gray-700 mb-2">关联角色</label>
      <select
        value={selectedId || ''}
        onChange={(e) => {
          const av = avatars.find((a) => a.id === e.target.value);
          onSelect(av || null);
        }}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      >
        <option value="">无角色</option>
        {avatars.map((a) => (
          <option key={a.id} value={a.id}>{a.name} ({a.avatar_style})</option>
        ))}
      </select>
    </div>
  );
}
