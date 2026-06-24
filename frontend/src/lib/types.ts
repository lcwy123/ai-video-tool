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

export interface VoicePreset {
  provider: string;
  voice_id: string;
  speed: number;
  pitch: number;
}

export interface Avatar {
  id: string;
  name: string;
  portrait: string | null;
  model_3d_url: string | null;
  voice_preset: VoicePreset | null;
  personality: string;
  avatar_style: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
}

export interface LLMConfig { provider: string; model: string; temperature: number; max_tokens: number; }
export interface TTSConfig { provider: string; voice_id: string; speed: number; }
export interface ImageGenConfig { provider: string; model: string; size: string; }
export interface VideoGenConfig { provider: string; model: string; }
export interface ModelConfig { llm: LLMConfig; tts: TTSConfig; image_gen: ImageGenConfig; video_gen: VideoGenConfig; }
export interface DefaultModelConfig { llm_providers: string[]; tts_providers: string[]; image_providers: string[]; video_providers: string[]; }
