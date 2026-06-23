# AI 视频制作工具 — 设计文档

## 概述

通用型的 AI 视频制作工具，支持 3D 虚拟角色创建、第一视角讲解、全流程可修改（文案/配音/视频/图片）、多轨道时间线编辑、视频合成导出，所有 AI 模型可随意配置。

## 技术架构

### 整体架构：Node.js + Python 混合架构

四层架构：

```
┌──────────────────────────────────────────┐
│  前端层 (Next.js + TypeScript)            │
│  Three.js 3D 渲染 / 分镜编辑 / 时间线     │
│  角色管理 / 模型配置                      │
├──────────────────────────────────────────┤
│  API 层 (Next.js API Routes / Fastify)    │
│  项目管理 / 分镜 CRUD / 资产存储 / 任务   │
├──────────────────────────────────────────┤
│  AI/视频处理层 (Python FastAPI)           │
│  LLM / TTS / 图像生成 / 视频生成 / FFmpeg │
├──────────────────────────────────────────┤
│  存储层                                   │
│  PostgreSQL / Redis / 对象存储            │
└──────────────────────────────────────────┘
```

### 通信方式

- **前端 ↔ Node.js**: HTTP REST + WebSocket（实时协作、生成进度推送）
- **Node.js ↔ Python**: HTTP 同步调用 + Redis 异步队列（耗时任务）
- **Python → 前端**: WebSocket 推送生成进度

### 为何选择此方案

- TypeScript 全栈（Next.js）前端开发高效，生态成熟
- Python 侧专注 AI/视频处理，职责清晰，不受干扰
- 初期可作为单一项目部署，后期可拆分
- 比纯 Python 方案有更好的实时性，比微服务方案运维简单

## 核心数据模型

### Project（项目）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| title | string | 项目名称 |
| scenes | Scene[] | 有序分镜列表 |
| avatar_id | UUID | 关联虚拟角色 |
| model_config | ModelConfig | 全局模型配置（可选，覆盖默认） |
| created_at | datetime | 创建时间 |

### Scene（分镜）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| project_id | UUID | 所属项目 |
| order | int | 排序序号 |
| duration | int | 时长（秒） |
| script | string | 文案内容 |
| voiceover_id | UUID | 配音音频 Asset |
| background_id | UUID | 背景视频/图片 Asset |
| avatar_action | string | 角色动作描述 |
| model_overrides | ModelConfig | 分镜级模型配置覆盖 |

### Avatar（虚拟角色）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | string | 角色名称 |
| portrait | string | 头像 URL |
| model_3d_url | string | 3D 模型文件 URL |
| voice_preset | VoiceConfig | 声音预设 |
| personality | string | 角色人设提示词 |
| avatar_style | enum | 写实/卡通/二次元 |

### ModelConfig（模型配置，可复用类型）

| 字段 | 类型 | 说明 |
|------|------|------|
| llm | LLMConfig | { provider, model, api_key, params } |
| tts | TTSConfig | { provider, model, voice_id, speed, pitch } |
| image_gen | ImageGenConfig | { provider, model, style, resolution } |
| video_gen | VideoGenConfig | { provider, model, fps, resolution } |

### Asset（资产）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| type | enum | audio / image / video / 3d_model |
| url | string | 文件 URL |
| thumbnail | string | 缩略图 URL |
| file_size | int | 文件大小 |
| source | enum | generated / uploaded / external |

## 核心工作流

### 1. 角色创建流程

填写角色设定 → 选择 3D 模型（预设模板/上传） → 配置声音（TTS 模型+音色） → 预览确认（3D 预览+试听）

### 2. 视频制作流程

1. **写剧本** — AI 辅助生成或手动编写分镜文案，LLM 模型可选
2. **生成配音** — 每段分镜生成 TTS 语音，模型/音色可逐段修改
3. **生成/上传素材** — 背景图片/视频，AI 生成或手动上传
4. **预览调整** — 时间线上微调每段分镜，任意元素可修改
5. **合成导出** — 整合所有素材，渲染最终视频

### 3. 全流程可修改

每个分镜的时间线卡片上，所有元素都可独立编辑（文案、配音、背景、角色动作、模型配置）。修改任一元素后，只需重新生成受影响的部分，无需全量重做。

## 界面设计

### 页面结构

| 页面 | 路径 | 说明 |
|------|------|------|
| 项目管理 | /projects | 项目列表、创建、最近编辑 |
| 角色管理 | /avatars | 角色列表、创建、3D 预览 |
| 编辑器 | /projects/:id/edit | 核心编辑页面 |
| 模型配置 | /settings/models | 全局模型配置 |

### 编辑器布局（三栏式）

```
┌──────────────┬───────────────────┬──────────────┐
│  分镜列表     │  3D 角色/视频预览  │  属性面板    │
│              │                   │              │
│  Scene 1     │                   │  文案编辑    │
│  Scene 2     │                   │  配音设置    │
│  Scene 3     ├───────────────────┤  背景设置    │
│  Scene 4     │  时间线            │  角色动作    │
│  + 添加分镜   │  [S1][S2][S3]...  │  模型覆盖    │
└──────────────┴───────────────────┴──────────────┘
```

## 模型配置系统

### 三级覆盖机制

1. **默认配置** — 系统内置默认模型，开箱即用
2. **项目级配置** — 覆盖默认，整个项目生效
3. **分镜级覆盖** — 只覆盖单个 Scene，最精细粒度

### Provider 抽象层

Python 侧通过统一的基类接口管理所有模型调用：

- `BaseLLMProvider.generate(prompt, config) → str`
- `BaseTTSProvider.synthesize(text, voice_config) → AudioFile`
- `BaseImageProvider.generate(prompt, config) → ImageFile`
- `BaseVideoProvider.generate(prompt, config) → VideoFile`

每个模型实现（OpenAI / Anthropic / Ollama / SD 等）继承对应基类。新增模型只需写新 Provider 实现，无需改业务逻辑。

## 技术选型

| 层 | 技术 | 理由 |
|----|------|------|
| 前端框架 | Next.js 14+ (React) | SSR、API 路由一体化，TypeScript 支持 |
| 3D 渲染 | Three.js / React Three Fiber | 成熟的 Web 3D 方案 |
| 样式 | Tailwind CSS | 高效开发，响应式设计 |
| Node.js API | Next.js API Routes / tRPC | 类型安全的端到端通信 |
| Python 框架 | FastAPI | 高性能异步，自动生成 OpenAPI |
| 任务队列 | Celery + Redis | 异步视频处理 |
| 视频处理 | FFmpeg | 成熟稳定的视频编辑方案 |
| 数据库 | PostgreSQL | 关系型数据存储 |
| 对象存储 | MinIO / S3 | 媒体文件存储 |
| 实时通信 | WebSocket (Socket.IO) | 进度推送 |

## 开发阶段规划

### Phase 1：核心框架搭建
- Next.js 项目初始化，基础布局
- Python FastAPI 服务搭建
- PostgreSQL 数据库 Schema
- 项目管理 CRUD

### Phase 2：编辑器核心
- 分镜编辑器（文案编辑、排序）
- TTS 配音生成（集成首个 Provider）
- 时间线基础实现
- 素材管理

### Phase 3：3D 角色系统
- 3D 角色创建/管理页面
- Three.js 角色渲染
- 角色声音配置
- 角色人设提示词 → 文案风格

### Phase 4：模型配置系统
- 三级覆盖机制实现
- 模型配置 UI
- Provider 抽象层（LLM / TTS / Image / Video）
- 多 Provider 支持

### Phase 5：视频合成
- FFmpeg 集成
- 背景/配音/角色合成
- 视频导出
- 进度推送

### Phase 6：多模态生成
- AI 图像生成集成
- AI 视频生成集成
- 素材智能推荐
