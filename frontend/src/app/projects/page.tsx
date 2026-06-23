import Link from 'next/link';
import ProjectCard from '@/components/projects/ProjectCard';

const mockProjects = [
  { id: '1', title: '示例项目', createdAt: '2024-01-01', sceneCount: 3 },
];

export default function ProjectsPage() {
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

      {mockProjects.length === 0 ? (
        <p className="text-gray-500">暂无项目，点击"新建项目"开始</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockProjects.map((p) => (
            <ProjectCard key={p.id} {...p} />
          ))}
        </div>
      )}
    </div>
  );
}
