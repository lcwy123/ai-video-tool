# AI Agent 对话式视频制作工具 — 设计文档

## 概述

在现有 AI 视频制作工具基础上，增加 **Agent 对话模式**，用户通过自然语言对话完成视频创作全流程。采用**规划器 + 执行器 (Planner-Executor)** 架构，支持自动执行和分步确认两种模式。

## 设计原则

- **对话为主** — 聊天是主要交互方式，现有 UI 降级为辅助预览
- **轻量精简** — 移除冗余的手动编辑功能，聚焦 Agent 自动化
- **模型灵活** — 全局配置默认模型，不同步骤可配置不同模型
- **性价比优先** — 简单任务用便宜/免费模型，创意任务用好模型

## 架构

```
用户对话 → 规划器 (Planner) → 执行器们 (Executors) → 现有 API
```

### 规划器 (Planner)
- 接收用户自然语言输入
- 拆解目标为步骤列表（DAG）
- 管理执行进度，支持自动/分步两种模式
- 调用不同的执行器完成任务
- 维护对话上下文和项目状态

### 执行器 (Executors)
每个执行器是单一职责的 Agent/NPC：

| 执行器 | 职责 | 调用 API |
|--------|------|----------|
| ScriptWriter | 撰写分镜文案 | LLM + /api/scenes |
| CharacterDesigner | 创建角色设定 | LLM + /api/avatars |
| AssetGenerator | 生成背景图片/配音 | /api/generate + /api/tts |
| VideoRenderer | 合成导出视频 | /api/render |

### 两种模式

| 模式 | 行为 |
|------|------|
| **自动模式** | 规划器拆解所有步骤 → 逐个执行 → 最终展示结果 |
| **分步模式** | 规划器每次执行一步 → 展示结果 → 问用户"继续还是修改？" |

用户可在对话中随时切换模式（"换自动模式吧" / "每一步都让我确认"）

## Agent Pipeline（标准视频制作流程）

```
1. 理解需求 — 分析用户输入，确定主题/风格/时长
   ↓
2. 创建角色/道具 — 生成角色设定、风格描述
   ↓
3. 撰写脚本 — 编写分镜文案，设定每段时长
   ↓
4. 生成素材 — 生成背景图片 + TTS 配音
   ↓
5. 合成视频 — FFmpeg 渲染导出
```

流程不是固定的，规划器可根据用户需求动态调整步骤。

## 对话界面布局

```
┌──────────────────────────────────┬──────────────────┐
│        对话面板 (Chat)            │   预览面板       │
│                                  │                  │
│  用户: 帮我做个 AI 科普视频       │   角色预览       │
│                                  │   ─────────     │
│  AI: 好的! 我来规划...           │   分镜列表       │
│      步骤 1/5: 创建角色 "小智"    │   ─────────     │
│      ✅ 已完成                    │   进度条 40%     │
│      ⏳ 请确认角色设定...         │                  │
│                                  │                  │
│  [继续] [修改] [换模型]           │                  │
│                                  │                  │
│  ┌──────────────────────────┐    │                  │
│  │ 输入指令...        [发送]│    │                  │
│  └──────────────────────────┘    │                  │
│  ⚡自动模式  ✓分步模式           │                  │
└──────────────────────────────────┴──────────────────┘
```

## 冗余清理

| 移除 | 保留 |
|------|------|
| 手动编辑器（SceneList/Timeline/SceneEditor） | 项目列表 |
| 手动素材上传面板（AssetPanel） | 角色列表 |
| 导出按钮（ExportButton） | 模型配置页面 |
| 手动分镜排序 | 后端所有 API |
| AIGenerator / SmartRecommendations | Provider 抽象层 |
| RenderProgress | FFmpeg 渲染服务 |

## 后端新增

### 1. Chat Agent API

```
POST /api/chat
  Request: { message: string, project_id?: string, mode: "auto" | "step" }
  Response: SSE stream (逐 token 输出 + 工具调用结果)

POST /api/chat/confirm
  Request: { session_id: string, action: "continue" | "modify" | "retry" }
```

### 2. Session 管理

每个对话 session 包含：
- 项目 ID（关联的 project）
- 当前步骤索引
- 步骤列表（plan）
- 模式（auto/step）
- 历史消息

### 3. Tool 定义

Agent 可调用的工具列表：

| Tool | 参数 | 说明 |
|------|------|------|
| create_character | name, style, personality | 创建角色 |
| write_script | project_id, scenes[] | 写入分镜 |
| generate_tts | scene_id, text, voice | 生成配音 |
| generate_image | prompt, style | 生成背景图 |
| render_video | project_id | 渲染导出 |
| get_progress | - | 查询进度 |

## 前端改动

### 新页面：对话创作页 `/create`

替代现有编辑器页面 `/projects/[id]/edit`，核心组件：
- `ChatPanel` — 对话消息列表 + 输入框 + 模式切换
- `PreviewPanel` — 当前状态预览（角色/分镜/进度）

### 导航调整

```
首页 → 项目列表 → 对话创作页
       → 角色列表
       → 模型配置
```

### 移除的页面/组件
- `/projects/[id]/edit` → 改为重定向到 `/create`
- `components/editor/` 下的大部分手动编辑组件

## 技术选型

| 组件 | 技术 | 说明 |
|------|------|------|
| Agent 实现 | OpenAI Assistants API / 自定义 ReAct Loop | 函数调用驱动 |
| 消息流 | Server-Sent Events (SSE) | 逐 token 流式输出 |
| Session 存储 | Redis / 内存 | 轻量，不持久化 |
| 前端聊天 | 自定义 React 组件 | 轻量，无额外依赖 |
| 模型路由 | 全局配置 + 步骤级覆盖 | 不同步骤用不同模型 |
