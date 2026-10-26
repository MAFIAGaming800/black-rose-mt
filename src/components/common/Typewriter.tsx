import React, { useState, useEffect, useRef } from 'react';
import { FastForward } from 'lucide-react';

interface TypewriterProps {
  text: string;
  speedMs?: number;
  onComplete?: () => void;
  className?: string;
  showSkip?: boolean;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speedMs = 35,
  onComplete,
  className = '',
  showSkip = true,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const onCompleteCalledRef = useRef(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayedText(text);
      setIsDone(true);
      if (!onCompleteCalledRef.current) {
        onCompleteCalledRef.current = true;
        onComplete?.();
      }
      return;
    }

    setDisplayedText('');
    setIsDone(false);
    onCompleteCalledRef.current = false;
    let currentIndex = 0;

    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(timer);
        setIsDone(true);
        if (!onCompleteCalledRef.current) {
          onCompleteCalledRef.current = true;
          onComplete?.();
        }
      }
    }, speedMs);

    return () => clearInterval(timer);
  }, [text, speedMs, onComplete]);

  const handleSkip = () => {
    setDisplayedText(text);
    setIsDone(true);
    if (!onCompleteCalledRef.current) {
      onCompleteCalledRef.current = true;
      onComplete?.();
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <span>{displayedText}</span>
      {!isDone && (
        <span
          className="inline-block w-2 h-4 ml-1 bg-[#B9905A] animate-pulse align-middle"
          aria-hidden="true"
        />
      )}
      {!isDone && showSkip && text.length > 50 && (
        <button
          onClick={handleSkip}
          className="ml-3 inline-flex items-center gap-1 text-[11px] font-sans px-2 py-0.5 rounded bg-[#181820] text-[#B9905A] border border-[#B9905A]/30 hover:bg-[#B9905A]/20 transition-colors"
          title="Skip animation"
          aria-label="Skip text animation"
        >
          <FastForward className="w-3 h-3" />
          <span>Skip</span>
        </button>
      )}
    </div>
  );
};
