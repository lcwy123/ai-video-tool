'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProjectCard from '@/components/projects/ProjectCard';
import { api } from '@/lib/api';
import type { Project } from '@/lib/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.listProjects()
      .then((data) => setProjects(data.projects))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6"><p className="text-gray-500">加载中...</p></div>;
  if (error) return <div className="p-6"><p className="text-red-500">加载失败: {error}</p></div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">项目列表</h1>
        <Link
          href="/projects/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          新建项目
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500">暂无项目，点击"新建项目"开始</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              id={p.id}
              title={p.title}
              createdAt={p.created_at}
              sceneCount={p.scene_count}
            />
          ))}
        </div>
      )}
    </div>
  );
}
