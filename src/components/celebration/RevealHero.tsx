import React, { useEffect, useState, useRef, useCallback } from 'react';
import { LogoContainer } from '../common/LogoContainer';
import { BrandBadge } from '../common/BrandBadge';
import { Typewriter } from '../common/Typewriter';
import { Sparkles, Heart } from 'lucide-react';

interface RevealHeroProps {
  logoUrl?: string | null;
  onComplete?: () => void;
  isPaused?: boolean;
}

export const RevealHero: React.FC<RevealHeroProps> = ({ logoUrl, onComplete, isPaused = false }) => {
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
    if (!onComplete || isPaused) return;

    // Gracefully advance after 14 seconds of display so user can enjoy the hero & ticker
    const totalDuration = 14000;
    const intervalTime = 100;
    const step = (intervalTime / totalDuration) * 100;

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
  }, [onComplete, isPaused, handleAdvance]);

  return (
    <section className="relative text-center py-12 px-4 max-w-4xl mx-auto flex flex-col items-center text-[#54263D]">
      {/* Brand Badge */}
      <div className="mb-6">
        <BrandBadge size="md" />
      </div>

      {/* Central Black Rose Graphic with Rose Gold & Pink Glow */}
      <div className="relative mb-6 group">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#FFE4EC] to-[#F8C8DC] border-2 border-[#B98575]/60 flex items-center justify-center shadow-[0_10px_35px_rgba(185,133,117,0.25)] relative overflow-hidden">
          {/* Blooming black rose SVG with rose gold and champagne accents */}
          <svg
            className="w-16 h-16 sm:w-20 sm:h-20 text-[#54263D] drop-shadow-md animate-pulse"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2C9 2 7 4 7 7c0 3 2 5 5 7 3-2 5-4 5-7 0-3-2-5-5-5z" fill="#3D1528" stroke="#B98575" />
            <path d="M12 14c-4 0-7 2-7 5 0 2 3 3 7 3s7-1 7-3c0-3-3-5-7-5z" fill="#54263D" stroke="#EFA7C4" />
            <path d="M12 9v11" stroke="#B98575" />
            <circle cx="12" cy="7" r="2" fill="#F7E7CE" />
          </svg>
        </div>
      </div>

      {/* Official Logo */}
      <div className="mb-4">
        <LogoContainer customLogoUrl={logoUrl} size="lg" />
      </div>

      {/* Title */}
      <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#54263D] mb-4">
        HAPPY BIRTHDAY <br />
        <span className="shimmer-text">BLACK ROSE MT</span>
      </h1>

      {/* Champagne Text Reveal in Glass Card */}
      <div className="max-w-2xl mx-auto glass-card rounded-2xl p-6 sm:p-8 text-base sm:text-lg text-[#54263D] font-serif leading-relaxed px-6 shadow-md border border-[#B98575]/30">
        <Typewriter
          text="Janam Din Bohat Mubarak Ho! Aaj ka yeh din aapki shandar shakhsiyat, izzat aur ba-waqar andaaz ka jashn hai. Dua hai ke aapki zindagi hamesha roshan rahe."
          speedMs={28}
          showSkip={false}
        />
      </div>

      {/* Auto-advance progress indicator with click-to-proceed option */}
      {onComplete && (
        <div className="mt-8 flex flex-col items-center gap-2.5">
          <button
            type="button"
            onClick={handleAdvance}
            className="flex items-center gap-2 text-xs font-serif text-[#834F6A] hover:text-[#54263D] transition-colors group cursor-pointer"
            title="Agle marhale par jaane ke liye click karein"
          >
            <Heart className="w-3.5 h-3.5 text-[#EFA7C4] fill-current animate-bounce group-hover:scale-110 transition-transform" />
            <span>Dosto ke lifafay khul rahe hain (Aage chalein &rarr;)</span>
          </button>
          <div className="w-52 h-1.5 bg-[#FFE4EC] rounded-full overflow-hidden border border-[#B98575]/20">
            <div
              className="h-full bg-gradient-to-r from-[#B98575] to-[#EFA7C4] transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </section>
  );
};
