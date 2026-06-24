'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AvatarForm from '@/components/avatar/AvatarForm';
import AvatarViewer from '@/components/avatar/AvatarViewer';
import VoiceConfig from '@/components/avatar/VoiceConfig';
import { api } from '@/lib/api';
import type { Avatar, VoicePreset } from '@/lib/types';

export default function EditAvatarPage() {
  const params = useParams();
  const router = useRouter();
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [voicePreset, setVoicePreset] = useState<VoicePreset | null>(null);

  useEffect(() => {
    api.getAvatar(params.id as string).then((a) => {
      setAvatar(a);
      setVoicePreset(a.voice_preset);
    });
  }, [params.id]);

  const handleUpdate = async (data: { name: string; personality: string; avatar_style: string }) => {
    await api.updateAvatar(params.id as string, data);
    router.push('/avatars');
  };

  const handleVoiceSave = (preset: VoicePreset) => {
    setVoicePreset(preset);
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
        <div className="w-80 space-y-6">
          <AvatarViewer className="w-80 h-80" />
          <VoiceConfig
            avatarId={params.id as string}
            initial={voicePreset}
            onSave={handleVoiceSave}
          />
        </div>
      </div>
    </div>
  );
}
