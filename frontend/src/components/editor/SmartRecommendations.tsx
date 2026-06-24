'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface SmartRecommendationsProps {
  script: string;
  style: string;
  onApplyBackground: (bg: string) => void;
}

export default function SmartRecommendations({ script, style, onApplyBackground }: SmartRecommendationsProps) {
  const [recommendation, setRecommendation] = useState<{
    suggested_background: string;
    suggested_mood: string;
    suggested_duration: number;
    tags: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!script.trim()) {
      setRecommendation(null);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const result = await api.recommendFromScript(script, style);
        setRecommendation(result);
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    }, 500); // Debounce

    return () => clearTimeout(timer);
  }, [script, style]);

  if (!recommendation && !loading) return null;

  return (
    <div className="border-t border-gray-200 pt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">💡 智能推荐</h4>
      {loading ? (
        <p className="text-xs text-gray-400">分析中...</p>
      ) : recommendation ? (
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">推荐背景:</span>
            <button
              onClick={() => onApplyBackground(recommendation.suggested_background)}
              className="text-blue-600 hover:text-blue-800"
            >
              {recommendation.suggested_background}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">氛围:</span>
            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{recommendation.suggested_mood}</span>
            <span className="text-gray-500">建议时长:</span>
            <span className="text-gray-700">{recommendation.suggested_duration}s</span>
          </div>
          <div className="flex gap-1 flex-wrap">
            {recommendation.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
