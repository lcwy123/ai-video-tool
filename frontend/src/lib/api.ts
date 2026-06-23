import type { Project, ProjectListResponse } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  listProjects: () =>
    request<ProjectListResponse>('/api/projects'),

  getProject: (id: string) =>
    request<Project>(`/api/projects/${id}`),

  createProject: (title: string) =>
    request<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),

  updateProject: (id: string, title: string) =>
    request<Project>(`/api/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title }),
    }),

  deleteProject: (id: string) =>
    request<void>(`/api/projects/${id}`, { method: 'DELETE' }),
};
