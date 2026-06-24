'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AvatarCard from '@/components/avatar/AvatarCard';
import { api } from '@/lib/api';
import type { Avatar } from '@/lib/types';

export default function AvatarsPage() {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listAvatars()
      .then(setAvatars)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">角色管理</h1>
        <Link
          href="/avatars/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          创建角色
        </Link>
      </div>
      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : avatars.length === 0 ? (
        <p className="text-gray-500">暂无角色，点击"创建角色"开始</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {avatars.map((a) => (
            <AvatarCard
              key={a.id}
              id={a.id}
              name={a.name}
              avatarStyle={a.avatar_style}
              personality={a.personality}
            />
          ))}
        </div>
      )}
    </div>
  );
}
