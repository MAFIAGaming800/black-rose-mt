import React, { useRef, useEffect, useCallback } from 'react';
import { Heart, Sparkles, Flame, ArrowRight } from 'lucide-react';
import { SHONA_BHAI_SECTION6_LETTER } from '../../config/content';
import { Typewriter } from '../common/Typewriter';

interface ShonaBhaiLetterProps {
  onComplete: () => void;
}

export const ShonaBhaiLetter: React.FC<ShonaBhaiLetterProps> = ({ onComplete }) => {
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

  const letter = SHONA_BHAI_SECTION6_LETTER;

  return (
    <section
      aria-label="From Shona Bhai, With Duas"
      className="min-h-screen py-16 px-4 max-w-4xl mx-auto flex flex-col items-center justify-center text-[#54263D] relative select-none"
    >
      {/* Background Ambience: Warm Candlelight Glow & Floating Rose Petals */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#F8C8DC]/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#B98575]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Decorative Warm Candles Header */}
      <div className="mb-4 flex items-center justify-center gap-4 text-xs font-serif font-semibold text-[#B98575]">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-500 animate-pulse fill-amber-400" />
          <span>Warm Candlelight Tribute</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-[#EFA7C4] fill-current" />
          <span>Section 6 Stationery Tribute</span>
        </div>
      </div>

      {/* Main Pink Letter Stationery Card (Preserving Second Stationery Reference Style, Strictly NO Video) */}
      <div className="w-full max-w-2xl bg-[#FFF5F8] border-2 border-[#B98575]/40 rounded-3xl p-8 sm:p-12 shadow-[0_25px_70px_rgba(185,133,117,0.22)] relative space-y-6">
        {/* Letter Top Stamp */}
        <div className="flex items-center justify-between pb-4 border-b border-[#B98575]/20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#FFE4EC] border border-[#B98575]/40 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-[#B98575]" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#54263D]">
                {letter.headerTitle}
              </h2>
              <span className="text-[11px] text-[#834F6A] font-serif">
                A Handwritten Brotherly Blessing
              </span>
            </div>
          </div>
          <span className="text-2xl">🌹</span>
        </div>

        {/* Salutation */}
        <div className="font-serif text-lg sm:text-xl font-bold text-[#54263D]">
          {letter.salutation}
        </div>

        {/* Letter Paragraphs with Typewriter Effect */}
        <div className="space-y-4 font-serif text-sm sm:text-base text-[#54263D] leading-relaxed">
          {letter.paragraphs.map((p, idx) => (
            <p key={idx} className={idx === 3 ? 'font-bold text-[#54263D] bg-[#FFE4EC]/50 p-2.5 rounded-xl border border-[#B98575]/20' : ''}>
              {idx === 0 ? (
                <Typewriter text={p} speedMs={20} showSkip={false} />
              ) : (
                p
              )}
            </p>
          ))}
        </div>

        {/* Letter Sign-off */}
        <div className="pt-6 border-t border-[#B98575]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="block text-xs font-serif text-[#834F6A] italic">
              {letter.signoffPre}
            </span>
            <span className="font-serif font-bold text-base text-[#54263D]">
              {letter.signature}
            </span>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#B98575] via-[#EFA7C4] to-[#B98575] text-white font-bold text-xs sm:text-sm tracking-wide hover:brightness-105 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 group animate-pulse"
          >
            <span>Final Birthday Reveal Par Chalein</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
