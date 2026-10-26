import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Moon, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { REQUIRED_FOUR_DUAS } from '../../config/content';
import { Typewriter } from '../common/Typewriter';

interface SkyFullOfDuasProps {
  onComplete: () => void;
}

export const SkyFullOfDuas: React.FC<SkyFullOfDuasProps> = ({ onComplete }) => {
  const [currentDuaIndex, setCurrentDuaIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const handleFinish = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    onCompleteRef.current?.();
  }, []);

  const totalDuas = REQUIRED_FOUR_DUAS.length;
  const currentDua = REQUIRED_FOUR_DUAS[currentDuaIndex];

  // Auto-advance each individual dua after comfortable reading dwell (12s)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentDuaIndex < totalDuas - 1) {
        setFadeKey((prev) => prev + 1);
        setCurrentDuaIndex((prev) => prev + 1);
      } else {
        handleFinish();
      }
    }, 12000);

    return () => clearTimeout(timer);
  }, [currentDuaIndex, totalDuas, handleFinish]);

  const handleNextDua = () => {
    if (currentDuaIndex < totalDuas - 1) {
      setFadeKey((prev) => prev + 1);
      setCurrentDuaIndex((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  return (
    <section
      aria-label="A Sky Full of Duas"
      className="min-h-screen relative flex flex-col items-center justify-center px-4 py-16 text-[#54263D] overflow-hidden select-none bg-gradient-to-b from-[#FFF0F5] via-[#FFE4EC] to-[#F8C8DC]"
    >
      {/* Dreamy Pink Night Sky Celestial Elements */}
      <div className="absolute top-10 right-12 text-[#B98575] opacity-80 pointer-events-none animate-pulse">
        <Moon className="w-16 h-16 sm:w-20 sm:h-20 fill-[#F7E7CE] text-[#B98575] drop-shadow-[0_0_25px_rgba(247,231,206,0.8)]" />
      </div>

      {/* Floating Shimmering Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-[#F7E7CE] rounded-full animate-ping" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-[#EFA7C4] rounded-full animate-pulse blur-2xs" />
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-[#B98575] rounded-full animate-pulse" />
        <div className="absolute top-2/3 right-1/6 w-2.5 h-2.5 bg-[#FFFAFC] rounded-full animate-ping" />
      </div>

      {/* Soft Cloud Silhouettes */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white/40 to-transparent pointer-events-none" />

      {/* Header Indicator */}
      <div className="mb-6 z-10 flex flex-col items-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/70 backdrop-blur-md border border-[#B98575]/30 text-xs font-semibold text-[#54263D] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#B98575]" />
          <span>A Sky Full of Duas 🌙 • Dua {currentDuaIndex + 1} of {totalDuas}</span>
        </div>
      </div>

      {/* Full-Screen Individual Stationery Card (Preserving First Stationery Reference Style) */}
      <div
        key={fadeKey}
        className="relative z-10 w-full max-w-2xl glass-card rounded-3xl border-2 border-[#B98575]/40 p-8 sm:p-12 shadow-[0_25px_70px_rgba(185,133,117,0.22)] text-center space-y-6 animate-in fade-in duration-500"
      >
        {/* Wax Seal & Ribbon Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#B98575] via-[#EFA7C4] to-[#B98575] border-2 border-white flex items-center justify-center text-white shadow-md text-2xl">
            {currentDua.symbol}
          </div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#B98575] font-bold">
            Wax-Sealed Shahi Dua
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#54263D]">
          {currentDua.title}
        </h3>

        {/* Cream Letter Area with Typewriter Dua Text */}
        <div className="bg-[#FFFDFB] rounded-2xl p-6 sm:p-8 border border-[#B98575]/25 shadow-inner">
          <p className="font-serif text-lg sm:text-2xl text-[#54263D] font-bold leading-relaxed mb-4">
            <Typewriter text={currentDua.text} speedMs={28} showSkip={false} />
          </p>

          <p className="text-xs sm:text-sm text-[#834F6A] font-serif italic pt-4 border-t border-[#B98575]/15">
            "{currentDua.english}"
          </p>
        </div>

        {/* Progress Dots and Next Action */}
        <div className="pt-4 flex items-center justify-between border-t border-[#B98575]/20">
          <div className="flex items-center gap-2">
            {REQUIRED_FOUR_DUAS.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentDuaIndex
                    ? 'w-8 bg-[#B98575]'
                    : i < currentDuaIndex
                    ? 'w-2 bg-[#EFA7C4]'
                    : 'w-2 bg-[#FFE4EC]'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNextDua}
            className="flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#B98575] to-[#834F6A] hover:brightness-105 rounded-full shadow-xs transition-all cursor-pointer group"
          >
            <span>
              {currentDuaIndex < totalDuas - 1 ? 'Agli Dua Dekhein' : 'Shona Bhai Ke Letter Par Chalein'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
