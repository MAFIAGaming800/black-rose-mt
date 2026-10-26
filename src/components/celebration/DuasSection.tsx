import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Heart, Feather, Shield, Award, Sparkles, Sun } from 'lucide-react';
import { DUAS_LIST } from '../../config/content';

interface DuasSectionProps {
  onComplete?: () => void;
}

export const DuasSection: React.FC<DuasSectionProps> = ({ onComplete }) => {
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

    // Dwell for 10 seconds to read prayers comfortably
    const duration = 10000;
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

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart':
        return <Heart className="w-5 h-5 text-[#EFA7C4]" />;
      case 'Feather':
        return <Feather className="w-5 h-5 text-[#B98575]" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-emerald-600" />;
      case 'Award':
        return <Award className="w-5 h-5 text-amber-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#B98575]" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#B98575]" />;
    }
  };

  return (
    <section className="py-12 px-4 max-w-5xl mx-auto text-[#54263D]" aria-labelledby="duas-heading">
      <div className="text-center mb-8 space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#B98575] font-semibold flex items-center justify-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-[#EFA7C4] fill-current" />
          <span>Dili Duayein • Sincere Prayers</span>
          <Heart className="w-3.5 h-3.5 text-[#EFA7C4] fill-current" />
        </span>
        <h2 id="duas-heading" className="font-serif text-2xl sm:text-4xl font-bold text-[#54263D]">
          Duas for BLACK ROSE MT
        </h2>
        <p className="text-xs sm:text-sm text-[#834F6A] max-w-md mx-auto">
          Allah Taala aapki zindagi ko har nematt, khushi aur hifazat se nawaze.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {DUAS_LIST.map((item) => (
          <div
            key={item.id}
            className="p-5 sm:p-6 rounded-3xl glass-card border border-[#B98575]/25 shadow-xs flex flex-col justify-between hover:-translate-y-1 transition-transform"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFE4EC] to-[#F8C8DC] border border-[#B98575]/35 flex items-center justify-center mb-4 shadow-xs">
                {getIcon(item.icon)}
              </div>
              <h3 className="font-serif text-lg font-bold text-[#54263D] mb-1">
                {item.categoryRomanUrdu}
              </h3>
              <p className="text-[11px] text-[#B98575] uppercase tracking-wider font-semibold mb-3">
                {item.categoryEnglish}
              </p>
              <p className="text-sm text-[#54263D] leading-relaxed font-serif mb-3">
                "{item.duaRomanUrdu}"
              </p>
            </div>

            <p className="text-xs text-[#834F6A] italic pt-3 border-t border-[#B98575]/15 font-serif">
              {item.meaning}
            </p>
          </div>
        ))}
      </div>

      {/* Auto advance progress bar with interactive advance option */}
      {onComplete && (
        <div className="mt-8 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleAdvance}
            className="text-xs font-serif text-[#834F6A] hover:text-[#54263D] transition-colors cursor-pointer"
            title="Agle marhale par jaane ke liye click karein"
          >
            Bhai ka paighaam samnay aa raha hai (Aage chalein &rarr;)
          </button>
          <div className="w-48 h-1.5 bg-[#FFE4EC] rounded-full overflow-hidden border border-[#B98575]/20">
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
