import Link from 'next/link';

interface AvatarCardProps {
  id: string;
  name: string;
  avatarStyle: string;
  personality: string;
}

export default function AvatarCard({ id, name, avatarStyle, personality }: AvatarCardProps) {
  return (
    <Link
      href={`/avatars/${id}/edit`}
      className="block p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">
          👤
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
            {avatarStyle}
          </span>
        </div>
      </div>
      {personality && (
        <p className="mt-2 text-sm text-gray-500 line-clamp-1">{personality}</p>
      )}
    </Link>
  );
}
