export interface Project {
  id: string;
  title: string;
  scene_count: number;
  created_at: string;
  updated_at: string;
}

export interface Scene {
  id: string;
  project_id: string;
  order: number;
  duration: number;
  script: string;
  voiceover_id: string | null;
  background_id: string | null;
  avatar_action: string;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  project_id: string;
  asset_type: string;
  url: string;
  thumbnail: string | null;
  file_size: number | null;
  source: string;
  file_name: string | null;
  created_at: string;
}

export interface AssetListResponse {
  assets: Asset[];
  total: number;
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
}
