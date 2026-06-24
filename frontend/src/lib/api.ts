import type { Asset, AssetListResponse, Project, ProjectListResponse, Scene } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers as Record<string, string>) },
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

  listScenes: (projectId: string) =>
    request<Scene[]>(`/api/scenes/project/${projectId}`),

  createScene: (projectId: string, script?: string) =>
    request<Scene>('/api/scenes', {
      method: 'POST',
      body: JSON.stringify({ project_id: projectId, script: script || '' }),
    }),

  updateScene: (id: string, data: Record<string, unknown>) =>
    request<Scene>(`/api/scenes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  reorderScenes: (sceneIds: string[]) =>
    request<Scene[]>('/api/scenes/reorder', {
      method: 'PUT',
      body: JSON.stringify({ scene_ids: sceneIds }),
    }),

  deleteScene: (id: string) =>
    request<void>(`/api/scenes/${id}`, { method: 'DELETE' }),

  listAssets: (projectId: string) =>
    request<AssetListResponse>(`/api/assets/project/${projectId}`),

  uploadAsset: (projectId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${API_BASE}/api/assets/upload/${projectId}`, {
      method: 'POST',
      body: formData,
    }).then((r) => r.json()) as Promise<Asset>;
  },

  deleteAsset: (id: string) =>
    request<void>(`/api/assets/${id}`, { method: 'DELETE' }),
};
