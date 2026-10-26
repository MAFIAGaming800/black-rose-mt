import React from 'react';
import { RotateCcw, Heart, Sparkles, Cake } from 'lucide-react';
import { LogoContainer } from '../common/LogoContainer';
import { BrandBadge } from '../common/BrandBadge';
import { FINAL_EMOTIONAL_LINES } from '../../config/content';
import { Typewriter } from '../common/Typewriter';

interface ReplayScreenProps {
  logoUrl?: string | null;
  onReplay: () => void;
}

export const ReplayScreen: React.FC<ReplayScreenProps> = ({ logoUrl, onReplay }) => {
  const content = FINAL_EMOTIONAL_LINES;

  return (
    <section
      aria-label="Final Birthday Reveal & Emotional Tribute"
      className="py-16 px-4 max-w-4xl mx-auto space-y-12 text-center text-[#54263D]"
    >
      {/* 1. Option C: Grand Cinematic Birthday Stage */}
      <div className="rounded-3xl glass-card border-2 border-[#B98575]/50 p-8 sm:p-14 shadow-[0_25px_80px_rgba(185,133,117,0.25)] space-y-8 relative overflow-hidden">
        {/* Soft radial glow */}
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-[#EFA7C4]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[#F7E7CE]/30 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Logo and Official Badge */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <LogoContainer customLogoUrl={logoUrl} size="lg" />
          <BrandBadge size="md" />
        </div>

        {/* Giant 3D "HAPPY BIRTHDAY BLACK ROSE MT" Typography */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#B98575] font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B98575] animate-pulse" />
            <span>The Grand Birthday Climax • Option C Reveal</span>
            <Sparkles className="w-4 h-4 text-[#B98575] animate-pulse" />
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-[#54263D] tracking-tight leading-tight">
            HAPPY BIRTHDAY <br />
            <span className="shimmer-text">BLACK ROSE MT</span>
          </h1>

          <div className="flex items-center justify-center gap-2 text-[#B98575] text-sm font-serif italic">
            <Cake className="w-4 h-4 text-[#EFA7C4]" />
            <span>Glowing Royal Cake • Shahi Mubarakbaad</span>
            <Cake className="w-4 h-4 text-[#EFA7C4]" />
          </div>
        </div>

        {/* Sincere Brotherly Dua Badge */}
        <div className="pt-2">
          <div className="py-3 px-6 rounded-full bg-[#FFE4EC] border border-[#B98575]/40 inline-flex items-center gap-2 text-xs sm:text-sm text-[#54263D] shadow-xs">
            <Sparkles className="w-4 h-4 text-[#B98575]" />
            <span className="font-serif font-bold text-[#54263D]">
              With duas, respect & friendship — From Shona Bhai
            </span>
          </div>
        </div>
      </div>

      {/* 2. Section 15: Final Emotional Message & Ending Sequence (No "Thank You for Being You") */}
      <div className="rounded-3xl glass-card border border-[#B98575]/40 p-8 sm:p-12 shadow-lg space-y-8 relative text-center">
        {/* Step 1: Selected Emotional Lines */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="p-4 rounded-2xl bg-[#FFE4EC]/70 border border-[#B98575]/30 shadow-xs">
            <p className="font-serif text-base sm:text-lg font-bold text-[#54263D] leading-relaxed">
              "{content.selectedLine1}"
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFE4EC]/70 border border-[#B98575]/30 shadow-xs">
            <p className="font-serif text-base sm:text-lg font-bold text-[#54263D] leading-relaxed">
              "{content.selectedLine2}"
            </p>
          </div>

          {/* Typewriter Emotional Paragraph */}
          <p className="text-sm sm:text-base text-[#834F6A] font-serif leading-relaxed italic pt-2">
            <Typewriter text={content.brotherlyMessage} speedMs={20} showSkip={false} />
          </p>
        </div>

        {/* Step 2: "Love From Your Shona Bhai" Reveal */}
        <div className="pt-4 flex items-center justify-center">
          <div className="py-2.5 px-6 rounded-full bg-gradient-to-r from-[#FFE4EC] via-white to-[#FFE4EC] border border-[#B98575]/40 inline-flex items-center gap-2.5 text-sm sm:text-base text-[#54263D] font-serif font-bold shadow-xs">
            <Heart className="w-4 h-4 text-[#EFA7C4] fill-current animate-bounce" />
            <span>{content.loveSignoff}</span>
            <Heart className="w-4 h-4 text-[#EFA7C4] fill-current animate-bounce" />
          </div>
        </div>

        {/* Step 3: Beautiful 3D "THANK YOU" Lettering */}
        <div className="pt-6 pb-2">
          <h2 className="font-cinzel text-4xl sm:text-6xl font-black text-[#54263D] tracking-widest drop-shadow-[0_4px_8px_rgba(185,133,117,0.3)] shimmer-text">
            {content.thankYou3D}
          </h2>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#B98575] font-semibold mt-1 block">
            For Being A Wonderful Soul & Royal Friend
          </span>
        </div>

        {/* Step 4: Replay Birthday Experience Button */}
        <div className="pt-6 border-t border-[#B98575]/20 flex flex-col items-center gap-2.5">
          <button
            onClick={onReplay}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-[#B98575] via-[#EFA7C4] to-[#B98575] text-[#FFFAFC] font-bold text-sm tracking-wide hover:brightness-105 active:scale-95 transition-all shadow-[0_4px_25px_rgba(185,133,117,0.35)] flex items-center gap-2.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>Replay Birthday Experience</span>
          </button>
          <span className="text-[11px] text-[#834F6A] font-sans font-medium">
            Safely restarts all stages, games, candles, and animations
          </span>
        </div>
      </div>
    </section>
  );
};
