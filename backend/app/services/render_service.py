import asyncio
import json
import subprocess
import uuid
from pathlib import Path

from app.config import settings


class RenderService:
    def __init__(self):
        self._active_tasks: dict[str, dict] = {}

    async def render_project(
        self,
        project_id: str,
        scenes: list[dict],
        output_format: str = "mp4",
        resolution: str = "1920x1080",
        fps: int = 30,
        progress_callback=None,
    ) -> str:
        task_id = str(uuid.uuid4())
        output_dir = Path(settings.upload_dir) / "renders" / project_id
        output_dir.mkdir(parents=True, exist_ok=True)
        output_path = output_dir / f"{task_id}.{output_format}"

        self._active_tasks[task_id] = {
            "status": "rendering",
            "progress": 0,
            "output_path": str(output_path),
        }

        try:
            clip_files = []
            for i, scene in enumerate(scenes):
                if progress_callback:
                    await progress_callback({
                        "status": "rendering",
                        "progress": (i / max(len(scenes), 1)) * 100,
                        "current_scene": i + 1,
                        "total_scenes": len(scenes),
                        "message": f"渲染分镜 {i + 1}/{len(scenes)}",
                    })

                clip_path = await self._render_scene(
                    scene, output_dir, i, resolution, fps
                )
                clip_files.append(clip_path)

            # Concatenate all clips
            if clip_files:
                await self._concat_clips(clip_files, output_path)
                # Cleanup individual clips
                for f in clip_files:
                    f.unlink(missing_ok=True)

            output_url = f"/uploads/renders/{project_id}/{task_id}.{output_format}"
            self._active_tasks[task_id].update({
                "status": "completed",
                "progress": 100,
                "output_url": output_url,
            })

            if progress_callback:
                await progress_callback({
                    "status": "completed",
                    "progress": 100,
                    "current_scene": len(scenes),
                    "total_scenes": len(scenes),
                    "message": "渲染完成",
                    "output_url": output_url,
                })

            return output_url

        except Exception as e:
            self._active_tasks[task_id]["status"] = "failed"
            if progress_callback:
                await progress_callback({
                    "status": "failed",
                    "progress": 0,
                    "message": str(e),
                })
            raise

    async def _render_scene(
        self, scene: dict, output_dir: Path, index: int, resolution: str, fps: int
    ) -> Path:
        """Render a single scene: background + voiceover + text overlay."""
        output_path = output_dir / f"scene_{index:04d}.mp4"
        script = scene.get("script", "")
        duration = scene.get("duration", 10)
        background_url = scene.get("background_url", "")
        voiceover_url = scene.get("voiceover_url", "")

        # Build FFmpeg command
        cmd = ["ffmpeg", "-y"]

        # Input: background (image or video)
        if background_url:
            cmd.extend(["-i", background_url])
        else:
            # Generate a colored background
            cmd.extend([
                "-f", "lavfi", "-i",
                f"color=c=blue:s={resolution}:d={duration}:r={fps}",
            ])

        # Input: voiceover audio (if available)
        has_audio = False
        if voiceover_url:
            cmd.extend(["-i", voiceover_url])
            has_audio = True

        # Build filter complex
        filters = []

        # Add text overlay (subtitles from script)
        if script:
            # Escape single quotes for FFmpeg
            safe_text = script.replace("'", "'\\\\\\''").replace(":", "\\:")
            filters.append(
                f"drawtext=text='{safe_text}':fontsize=24:fontcolor=white:"
                f"x=(w-text_w)/2:y=h-text_h-50:box=1:boxcolor=black@0.5:"
                f"boxborderw=10"
            )

        if filters:
            cmd.extend(["-vf", ",".join(filters)])

        # Audio mapping
        if has_audio:
            cmd.extend(["-map", "0:v", "-map", "1:a", "-shortest"])
        else:
            cmd.extend(["-map", "0:v"])

        cmd.extend([
            "-c:v", "libx264", "-preset", "fast",
            "-c:a", "aac",
            "-t", str(duration),
            str(output_path),
        ])

        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        _, stderr = await proc.communicate()

        if proc.returncode != 0:
            raise RuntimeError(f"FFmpeg failed: {stderr.decode()[:500]}")

        return output_path

    async def _concat_clips(self, clip_paths: list[Path], output_path: Path):
        """Concatenate multiple clips into one video."""
        list_path = output_path.with_suffix(".txt")
        list_path.write_text("\n".join(f"file '{p}'" for p in clip_paths))

        cmd = [
            "ffmpeg", "-y",
            "-f", "concat", "-safe", "0",
            "-i", str(list_path),
            "-c", "copy",
            str(output_path),
        ]
        proc = await asyncio.create_subprocess_exec(
            *cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE,
        )
        _, stderr = await proc.communicate()
        list_path.unlink(missing_ok=True)

        if proc.returncode != 0:
            raise RuntimeError(f"FFmpeg concat failed: {stderr.decode()[:500]}")

    def get_task(self, task_id: str) -> dict | None:
        return self._active_tasks.get(task_id)
