'use client';

import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/projects/ProjectForm';
import { api } from '@/lib/api';

export default function NewProjectPage() {
  const router = useRouter();

  const handleCreate = async (title: string) => {
    await api.createProject(title);
    router.push('/projects');
  };

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">新建项目</h1>
      <ProjectForm onSubmit={handleCreate} />
    </div>
  );
}
