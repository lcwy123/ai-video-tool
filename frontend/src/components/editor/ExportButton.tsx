'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import RenderProgressBar from './RenderProgress';

interface ExportButtonProps {
  projectId: string;
  onRenderComplete?: (outputUrl: string) => void;
}

export default function ExportButton({ projectId, onRenderComplete }: ExportButtonProps) {
  const [rendering, setRendering] = useState(false);
  const [progress, setProgress] = useState({ status: '', progress: 0, message: '' });
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    return () => { /* cleanup on unmount */ };
  }, []);

  const handleExport = async () => {
    setRendering(true);
    setShowProgress(true);
    setProgress({ status: 'pending', progress: 0, message: '开始渲染...' });

    try {
      const { task_id } = await api.startRender(projectId);

      const poll = setInterval(async () => {
        try {
          const status = await api.getRenderStatus(task_id);
          setProgress({
            status: status.status,
            progress: status.progress,
            message: status.message,
          });
          if (status.output_url) setOutputUrl(status.output_url);
          if (status.status === 'completed' || status.status === 'failed') {
            clearInterval(poll);
            setRendering(false);
            if (status.status === 'completed' && status.output_url && onRenderComplete) {
              onRenderComplete(status.output_url);
            }
          }
        } catch {
          clearInterval(poll);
          setRendering(false);
        }
      }, 1000);
    } catch {
      setProgress({ status: 'failed', progress: 0, message: '启动渲染失败' });
      setRendering(false);
    }
  };

  return (
    <>
      <button
        onClick={handleExport}
        disabled={rendering}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
      >
        {rendering ? '渲染中...' : '导出视频'}
      </button>
      {showProgress && (
        <RenderProgressBar
          status={progress.status}
          progress={progress.progress}
          message={progress.message}
          outputUrl={outputUrl}
          onClose={() => setShowProgress(false)}
        />
      )}
    </>
  );
}
