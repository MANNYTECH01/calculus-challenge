import React from 'react';
import { BookOpen, Play } from 'lucide-react';
import { MathText } from '@/components/MathRenderer';

interface ExplanationRendererProps {
  explanation: string;
  className?: string;
}

/**
 * Component to render explanations that can be either text or video URLs
 * Supports YouTube URLs and displays them as embedded videos
 */
export const ExplanationRenderer: React.FC<ExplanationRendererProps> = ({ 
  explanation, 
  className = "" 
}) => {
  // Check if explanation is a YouTube URL
  const isYouTubeUrl = (url: string): boolean => {
    const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    return youtubePattern.test(url.trim());
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  // Check if it's a general video URL
  const isVideoUrl = (url: string): boolean => {
    const videoExtensions = /\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv)$/i;
    return videoExtensions.test(url.trim()) || isYouTubeUrl(url);
  };

  const trimmedExplanation = explanation.trim();

  // If it's a YouTube URL, render embedded video
  if (isYouTubeUrl(trimmedExplanation)) {
    const videoId = getYouTubeVideoId(trimmedExplanation);
    if (videoId) {
      return (
        <div className={`p-4 bg-sky-50 dark:bg-sky-900/20 border-l-4 border-sky-500 rounded-r-lg ${className}`}>
          <h4 className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-2 mb-3">
            <Play className="h-4 w-4" />
            Video Explanation
          </h4>
          <div className="aspect-video rounded-lg overflow-hidden bg-black/10">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="Video Explanation"
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              loading="lazy"
            />
          </div>
        </div>
      );
    }
  }

  // If it's another video URL, show a link
  if (isVideoUrl(trimmedExplanation)) {
    return (
      <div className={`p-4 bg-sky-50 dark:bg-sky-900/20 border-l-4 border-sky-500 rounded-r-lg ${className}`}>
        <h4 className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-2 mb-3">
          <Play className="h-4 w-4" />
          Video Explanation
        </h4>
        <a 
          href={trimmedExplanation}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 underline"
        >
          <Play className="h-4 w-4" />
          Watch Video Explanation
        </a>
      </div>
    );
  }

  // Default: render as text explanation
  return (
    <div className={`p-4 bg-sky-50 dark:bg-sky-900/20 border-l-4 border-sky-500 rounded-r-lg ${className}`}>
      <h4 className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-2 mb-3">
        <BookOpen className="h-4 w-4" />
        Explanation
      </h4>
      <div className="text-sm text-muted-foreground pl-6">
        <MathText>{explanation}</MathText>
      </div>
    </div>
  );
};

export default ExplanationRenderer;