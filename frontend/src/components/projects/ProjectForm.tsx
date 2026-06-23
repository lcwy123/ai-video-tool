'use client';

import { useState, FormEvent } from 'react';

interface ProjectFormProps {
  initialTitle?: string;
  onSubmit: (title: string) => Promise<void>;
}

export default function ProjectForm({ initialTitle = '', onSubmit }: ProjectFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onSubmit(title.trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">项目名称</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
          placeholder="输入项目名称"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? '提交中...' : '创建项目'}
      </button>
    </form>
  );
}
