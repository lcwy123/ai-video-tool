'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AvatarForm from '@/components/avatar/AvatarForm';
import AvatarViewer from '@/components/avatar/AvatarViewer';
import { api } from '@/lib/api';
import type { Avatar } from '@/lib/types';

export default function EditAvatarPage() {
  const params = useParams();
  const router = useRouter();
  const [avatar, setAvatar] = useState<Avatar | null>(null);

  useEffect(() => {
    api.getAvatar(params.id as string).then(setAvatar);
  }, [params.id]);

  const handleUpdate = async (data: { name: string; personality: string; avatar_style: string }) => {
    await api.updateAvatar(params.id as string, data);
    router.push('/avatars');
  };

  if (!avatar) return <div className="p-6"><p className="text-gray-500">加载中...</p></div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">编辑角色</h1>
      <div className="flex gap-8">
        <div className="flex-1">
          <AvatarForm
            initial={{ name: avatar.name, personality: avatar.personality, avatarStyle: avatar.avatar_style }}
            onSubmit={handleUpdate}
          />
        </div>
        <AvatarViewer className="w-72 h-72" />
      </div>
    </div>
  );
}
