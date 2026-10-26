import React, { useEffect, useState, useRef, useCallback } from 'react';
import { HeartHandshake, Shield, Sparkles } from 'lucide-react';
import { EMOTIONAL_CLOSING } from '../../config/content';

interface EmotionalClosingProps {
  onComplete?: () => void;
}

export const EmotionalClosing: React.FC<EmotionalClosingProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const handleAdvance = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    onCompleteRef.current?.();
  }, []);

  useEffect(() => {
    if (!onComplete) return;

    // 8-second comfortable reading dwell
    const duration = 8000;
    const intervalTime = 100;
    const step = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            handleAdvance();
          }, 0);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onComplete, handleAdvance]);

  return (
    <section className="py-12 px-4 max-w-3xl mx-auto text-center text-[#54263D]" aria-labelledby="closing-message-heading">
      <div className="relative rounded-3xl glass-card border border-[#B98575]/40 p-6 sm:p-10 shadow-lg space-y-6">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFE4EC] to-[#F8C8DC] border border-[#B98575]/60 flex items-center justify-center mx-auto text-[#B98575] shadow-xs">
          <HeartHandshake className="w-7 h-7 text-[#B98575]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#B98575] font-semibold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#EFA7C4]" />
            <span>Bhai Ka Ahtraam Aur Sachha Rishta</span>
            <Sparkles className="w-3.5 h-3.5 text-[#EFA7C4]" />
          </span>
          <h2 id="closing-message-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#54263D]">
            {EMOTIONAL_CLOSING.title}
          </h2>
        </div>

        <p className="text-sm sm:text-base text-[#54263D] leading-relaxed font-serif max-w-2xl mx-auto">
          {EMOTIONAL_CLOSING.brotherlyNote}
        </p>

        <div className="pt-4 border-t border-[#B98575]/20 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-[#834F6A]">
          <div className="flex items-center gap-1.5 font-semibold">
            <Shield className="w-4 h-4 text-[#B98575]" />
            <span>Honorable Brotherly Friendship</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span className="font-medium">From Shona Bhai</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-[#54263D] font-serif font-bold">For BLACK ROSE MT</span>
        </div>

        {/* Auto progress bar with interactive advance option */}
        {onComplete && (
          <div className="pt-4 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleAdvance}
              className="text-xs font-serif text-[#834F6A] hover:text-[#54263D] transition-colors cursor-pointer"
              title="Agle marhale par jaane ke liye click karein"
            >
              Grand Finale samnay aa raha hai (Aage chalein &rarr;)
            </button>
            <div className="w-48 h-1.5 bg-[#FFE4EC] rounded-full overflow-hidden border border-[#B98575]/20">
              <div
                className="h-full bg-gradient-to-r from-[#B98575] to-[#EFA7C4] transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
