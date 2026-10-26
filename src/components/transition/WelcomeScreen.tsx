import React, { useState, useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { LogoContainer } from '../common/LogoContainer';
import { BrandBadge } from '../common/BrandBadge';

export interface WelcomeScreenProps {
  onEnterGarden?: () => void;
  onTransition?: (stage: 'GATE_ANIMATION') => void;
  setStage?: (stage: 'GATE_ANIMATION') => void;
  portraitUrl?: string | null;
  logoUrl?: string | null;
  onOpenAdmin?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onEnterGarden,
  onTransition,
  setStage,
  portraitUrl,
  logoUrl,
  onOpenAdmin,
}) => {
  const [displayedLine1, setDisplayedLine1] = useState('');
  const [displayedLine2, setDisplayedLine2] = useState('');
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);

  const fullLine1 = 'Welcome to a Little World of Magic 🌸';
  const fullLine2 = 'Made with Love for BLACK ROSE MT 💗';

  // Smooth typewriter animation on mount
  useEffect(() => {
    let index1 = 0;
    let index2 = 0;
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;

    timer1 = setInterval(() => {
      if (index1 <= fullLine1.length) {
        setDisplayedLine1(fullLine1.slice(0, index1));
        index1++;
      } else {
        clearInterval(timer1);
        timer2 = setInterval(() => {
          if (index2 <= fullLine2.length) {
            setDisplayedLine2(fullLine2.slice(0, index2));
            index2++;
          } else {
            clearInterval(timer2);
            setIsTypewriterDone(true);
          }
        }, 30);
      }
    }, 35);

    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
    };
  }, []);

  const handleEnterClick = () => {
    if (onEnterGarden) {
      onEnterGarden();
    } else if (onTransition) {
      onTransition('GATE_ANIMATION');
    } else if (setStage) {
      setStage('GATE_ANIMATION');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FFF0F5] text-[#54263D] flex flex-col items-center justify-between px-4 py-6 overflow-hidden selection:bg-[#F8C8DC] selection:text-[#54263D]">
      {/* Background Soft Glow & Petal Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FFE4EC]/70 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#F8C8DC]/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] rounded-full bg-[#FFE4EC]/40 blur-3xl pointer-events-none" />
      </div>

      {/* Top Header with Brand Identity, Badge, and Admin Button */}
      <header className="relative w-full max-w-4xl mx-auto flex items-center justify-between gap-4 pt-2 z-20">
        <LogoContainer customLogoUrl={logoUrl} size="sm" />
        <div className="flex items-center gap-2.5 sm:gap-3">
          <BrandBadge size="sm" />
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              aria-label="Open Admin Settings"
              className="text-xs px-3.5 py-1.5 rounded-full bg-[#FFFAFC]/90 hover:bg-[#FFE4EC] border border-[#B98575]/40 text-[#54263D] transition-colors shadow-sm font-medium cursor-pointer"
            >
              Admin
            </button>
          )}
        </div>
      </header>

      {/* Main Welcome Hero Content */}
      <main className="relative my-auto py-8 flex flex-col items-center max-w-2xl mx-auto z-20 text-center animate-in fade-in duration-700">
        {/* Portrait / Logo Emblem with soft cinematic lighting */}
        <div className="relative group mb-6">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#B98575] via-[#EFA7C4] to-[#F8C8DC] opacity-45 blur-xl animate-pulse" />
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1.5 bg-gradient-to-b from-[#B98575] via-[#FFE4EC] to-[#B98575]/70 shadow-[0_12px_40px_rgba(185,133,117,0.35)] overflow-hidden">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#FFFAFC] flex items-center justify-center relative">
              {portraitUrl ? (
                <img
                  src={portraitUrl}
                  alt="BLACK ROSE MT"
                  className="w-full h-full object-cover object-center scale-[1.12] transition-transform duration-700 group-hover:scale-120"
                  referrerPolicy="no-referrer"
                />
              ) : logoUrl ? (
                <img
                  src={logoUrl}
                  alt="BLACK ROSE MT Logo"
                  className="w-full h-full object-contain p-3"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-3 text-[#B98575]">
                  <Sparkles className="w-8 h-8 text-[#EFA7C4] mb-1 animate-pulse" />
                  <span className="font-cinzel text-xs font-bold text-[#54263D] tracking-widest uppercase">
                    BLACK ROSE MT
                  </span>
                  <span className="text-[10px] text-[#834F6A] italic mt-0.5 font-serif">
                    Royal Celebration
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Smooth Typewriter Welcome Text */}
        <div className="space-y-3 mb-8 px-4">
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#54263D] min-h-[2.5rem] sm:min-h-[3.5rem] flex items-center justify-center drop-shadow-[0_2px_12px_rgba(239,167,196,0.4)]">
            <span>{displayedLine1}</span>
            {displayedLine1.length < fullLine1.length && (
              <span className="inline-block w-0.5 h-6 sm:h-8 bg-[#B98575] ml-1 animate-pulse" />
            )}
          </h1>

          <p className="font-serif text-base sm:text-xl md:text-2xl font-medium text-[#834F6A] min-h-[2rem] flex items-center justify-center">
            <span>{displayedLine2}</span>
            {displayedLine1.length >= fullLine1.length &&
              displayedLine2.length < fullLine2.length && (
                <span className="inline-block w-0.5 h-5 sm:h-6 bg-[#B98575] ml-1 animate-pulse" />
              )}
          </p>

          <p className="text-xs sm:text-sm text-[#B98575] font-serif tracking-widest uppercase pt-1">
            • 17 November 2026 •
          </p>
        </div>

        {/* Enter the Magical Garden Button (Transitions stage to GATE_ANIMATION) */}
        <div className="transition-all duration-500 transform">
          <button
            onClick={handleEnterClick}
            className={`group relative inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#B98575] via-[#EFA7C4] to-[#B98575] text-[#FFFAFC] font-serif font-bold text-sm sm:text-base tracking-wide shadow-[0_8px_30px_rgba(185,133,117,0.35)] hover:shadow-[0_12px_40px_rgba(239,167,196,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden border border-[#F7E7CE]/60 ${
              isTypewriterDone ? 'animate-bounce' : ''
            }`}
          >
            <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Sparkles className="w-4 h-4 text-[#F7E7CE] animate-spin" />
            <span>Enter the Magical Garden ✨</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative w-full max-w-4xl mx-auto text-center text-xs text-[#834F6A]/80 pt-4 z-20 flex items-center justify-center gap-1.5">
        <Heart className="w-3 h-3 text-[#EFA7C4] fill-current" />
        <span>BLACK ROSE MT Birthday Celebration • Presented by Shona Bhai</span>
      </footer>
    </div>
  );
};
export default WelcomeScreen;
