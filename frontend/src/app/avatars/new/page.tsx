'use client';

import { useRouter } from 'next/navigation';
import AvatarForm from '@/components/avatar/AvatarForm';
import { api } from '@/lib/api';

export default function NewAvatarPage() {
  const router = useRouter();

  const handleCreate = async (data: { name: string; personality: string; avatar_style: string }) => {
    await api.createAvatar(data);
    router.push('/avatars');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">创建角色</h1>
      <AvatarForm onSubmit={handleCreate} />
    </div>
  );
}
