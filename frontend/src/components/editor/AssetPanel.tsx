'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import type { Asset } from '@/lib/types';

interface AssetPanelProps {
  projectId: string;
}

export default function AssetPanel({ projectId }: AssetPanelProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadAssets = async () => {
    try {
      const data = await api.listAssets(projectId);
      setAssets(data.assets);
    } catch {
      // Backend may not be running
    }
  };

  useEffect(() => { loadAssets(); }, [projectId]);

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await api.uploadAsset(projectId, file);
      loadAssets();
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="p-4">
      <h3 className="font-medium text-gray-700 mb-3">素材库</h3>
      <div className="mb-3">
        <input
          ref={fileRef}
          type="file"
          onChange={handleUpload}
          className="block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={uploading}
        />
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {assets.length === 0 && (
          <p className="text-sm text-gray-400">暂无素材</p>
        )}
        {assets.map((asset) => (
          <div key={asset.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md text-sm">
            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 text-gray-600 uppercase">
              {asset.asset_type}
            </span>
            <span className="flex-1 truncate text-gray-700">{asset.file_name || asset.url}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
