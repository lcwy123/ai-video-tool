'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/projects/ProjectForm';
import { api } from '@/lib/api';

export default function NewProjectPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (title: string) => {
    setError(null);
    try {
      await api.createProject(title);
      router.push('/projects');
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建失败');
    }
  };

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">新建项目</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}
      <ProjectForm onSubmit={handleCreate} />
    </div>
  );
}
