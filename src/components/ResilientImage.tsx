import { useState } from 'react';
import { Zap } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F4EFF8] via-[#FFFFFF] to-[#FEF7E6] border border-slate-200 text-slate-600 p-6 ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-12 h-12 rounded-xl bg-[#741B7E]/10 text-[#741B7E] flex items-center justify-center mb-3">
          <Zap className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-center text-slate-700">
          {fallbackTitle || alt}
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
