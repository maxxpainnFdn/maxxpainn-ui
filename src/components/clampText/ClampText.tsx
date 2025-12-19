// @/components/ui/text-clamp.tsx

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ClampTextProps {
  text: string;
  lines?: number;
  className?: string;
  expandLabel?: string;
  collapseLabel?: string;
  showToggle?: boolean;
}

const ClampText = ({
  text,
  lines = 2,
  className,
  expandLabel = 'Read more',
  collapseLabel = 'Show less',
  showToggle = true
}: ClampTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Check if text is actually clamped (overflowing)
  useEffect(() => {
    const checkClamped = () => {
      if (textRef.current) {
        const { scrollHeight, clientHeight } = textRef.current;
        setIsClamped(scrollHeight > clientHeight);
      }
    };

    checkClamped();

    // Recheck on window resize
    window.addEventListener('resize', checkClamped);
    return () => window.removeEventListener('resize', checkClamped);
  }, [text, lines]);

  const lineClampClass: Record<number, string> = {
    1: 'line-clamp-1',
    2: 'line-clamp-2',
    3: 'line-clamp-3',
    4: 'line-clamp-4',
    5: 'line-clamp-5',
    6: 'line-clamp-6',
  };

  return (
    <div className="relative">
      <p
        ref={textRef}
        className={cn(
          'text-gray-300 transition-all duration-300 ease-in-out',
          !isExpanded && lineClampClass[lines],
          className
        )}
      >
        {text}
      </p>

      {showToggle && isClamped && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-1 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
        >
          {isExpanded ? collapseLabel : expandLabel}
        </button>
      )}
    </div>
  );
};

export default ClampText;
