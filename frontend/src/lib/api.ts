import type { Asset, AssetListResponse, Avatar, DefaultModelConfig, ModelConfig, Project, ProjectListResponse, Scene } from './types';

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
  startRender: (projectId: string) =>
    request<{ task_id: string; status: string }>(`/api/render/project/${projectId}`, { method: 'POST' }),

  getRenderStatus: (taskId: string) =>
    request<{ status: string; progress: number; message: string; output_url?: string }>(
      `/api/render/status/${taskId}`
    ),

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

  listAvatars: () =>
    request<Avatar[]>('/api/avatars'),

  getAvatar: (id: string) =>
    request<Avatar>(`/api/avatars/${id}`),

  createAvatar: (data: Record<string, unknown>) =>
    request<Avatar>('/api/avatars', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateAvatar: (id: string, data: Record<string, unknown>) =>
    request<Avatar>(`/api/avatars/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteAvatar: (id: string) =>
    request<void>(`/api/avatars/${id}`, { method: 'DELETE' }),

  getDefaultModelConfig: () =>
    request<DefaultModelConfig>('/api/model-config/default'),

  updateProjectModelConfig: (projectId: string, config: ModelConfig) =>
    request<void>(`/api/model-config/project/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(config),
    }),

  generateImage: (projectId: string, prompt: string) =>
    request<Asset>('/api/generate/image', {
      method: 'POST',
      body: JSON.stringify({ project_id: projectId, prompt }),
    }),

  generateVideo: (projectId: string, prompt: string, duration?: number) =>
    request<Asset>('/api/generate/video', {
      method: 'POST',
      body: JSON.stringify({ project_id: projectId, prompt, duration: duration || 5 }),
    }),

  recommendFromScript: (script: string, style?: string) =>
    request<{
      suggested_background: string;
      suggested_style: string;
      suggested_duration: number;
      suggested_mood: string;
      tags: string[];
    }>('/api/recommend/from-script', {
      method: 'POST',
      body: JSON.stringify({ script, style: style || '写实' }),
    }),
};
