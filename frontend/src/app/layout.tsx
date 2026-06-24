import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'AI Video Tool',
  description: 'AI 视频制作工具',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 min-h-screen bg-gray-50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
