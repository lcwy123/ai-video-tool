export interface Project {
  id: string;
  title: string;
  scene_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
}
