import React from 'react';
import { BookOpen, Play } from 'lucide-react';
import { MathText } from '@/components/MathRenderer';

interface ExplanationRendererProps {
  explanation: string;
  className?: string;
}

export const ExplanationRenderer: React.FC<ExplanationRendererProps> = ({ 
  explanation, 
  className = "" 
}) => {
  const isYouTubeUrl = (url: string): boolean => {
    const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    return youtubePattern.test(url.trim());
  };

  const getYouTubeVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const isVideoUrl = (url: string): boolean => {
    const videoExtensions = /\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv)$/i;
    return videoExtensions.test(url.trim()) || isYouTubeUrl(url);
  };

  const trimmedExplanation = explanation.trim();

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

  // Split explanation by newline characters and render each line separately
  const explanationLines = explanation.split('\n').filter(line => line.trim() !== '');

  return (
    <div className={`p-4 bg-sky-50 dark:bg-sky-900/20 border-l-4 border-sky-500 rounded-r-lg ${className}`}>
      <h4 className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-2 mb-3">
        <BookOpen className="h-4 w-4" />
        Explanation
      </h4>
      <div className="text-sm text-muted-foreground pl-6 space-y-2">
        {explanationLines.map((line, index) => (
          <MathText key={index}>{line}</MathText>
        ))}
      </div>
    </div>
  );
};

export default ExplanationRenderer;