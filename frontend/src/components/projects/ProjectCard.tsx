import Link from 'next/link';

interface ProjectCardProps {
  id: string;
  title: string;
  createdAt: string;
  sceneCount: number;
}

export default function ProjectCard({ id, title, createdAt, sceneCount }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${id}/edit`}
      className="block p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
    >
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <div className="mt-2 text-sm text-gray-500">
        <span>{sceneCount} 个分镜</span>
        <span className="mx-2">·</span>
        <span>{createdAt}</span>
      </div>
    </Link>
  );
}
