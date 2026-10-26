import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Gift, Sparkles, HeartHandshake, ChevronDown, ChevronUp, Mail, Shield, Heart } from 'lucide-react';
import { LogoContainer } from '../common/LogoContainer';
import { BrandBadge } from '../common/BrandBadge';
import { PERSONAL_LETTER_SHONA_BHAI } from '../../config/content';

interface SpecialGiftProps {
  logoUrl?: string | null;
  onComplete?: () => void;
}

export const SpecialGift: React.FC<SpecialGiftProps> = ({ logoUrl, onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKeepsake, setSelectedKeepsake] = useState<number | null>(null);
  const [autoProgress, setAutoProgress] = useState(0);
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

  const extraKeepsakes = [
    {
      id: 1,
      title: 'Hamesha Ki Dua',
      subtitle: 'Sincere Prayers',
      text: 'Meri behen BLACK ROSE MT ke liye har naya din dhero barkat, roshni aur izzat laye. Allah aapko hamesha apni amaan mein rakhe.',
      icon: Heart,
    },
    {
      id: 2,
      title: 'Bhai Ka Sath',
      subtitle: 'Unshakable Support',
      text: 'Zindagi ke kisi bhi mor par jab bhi aapko kisi sache dost ya mukhlis bhai ke mashwaray aur sath ki zaroorat ho, Shona Bhai hamesha aapke sath khada hai.',
      icon: Shield,
    },
    {
      id: 3,
      title: 'Izzat-o-Waqar',
      subtitle: 'Pride & Respect',
      text: 'Aapka ba-waqar andaaz, samajhdaari aur humble nature hum sab ke liye fakhar ka baais hai. Hamesha aese hi sar utha kar jeeyin.',
      icon: Sparkles,
    },
  ];

  // Auto-progress timer when gift is opened
  useEffect(() => {
    if (!isOpen || !onComplete) return;

    // After opening the letter, progress over 10 seconds for comfortable reading
    const duration = 10000;
    const intervalTime = 100;
    const step = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
      setAutoProgress((prev) => {
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
  }, [isOpen, onComplete, handleAdvance]);

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto text-[#54263D]" aria-labelledby="special-gift-heading">
      <div className="relative rounded-3xl glass-card border border-[#B98575]/35 p-6 sm:p-10 shadow-[0_16px_50px_rgba(185,133,117,0.15)] text-[#54263D] overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#EFA7C4]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-[#B98575]/20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFE4EC] to-[#F8C8DC] border border-[#B98575]/50 flex items-center justify-center text-[#B98575] shadow-xs">
              <Gift className="w-7 h-7 text-[#B98575] animate-pulse" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B98575] font-semibold">
                Khaas Tohfa • Brotherly Tribute
              </span>
              <h2 id="special-gift-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#54263D]">
                {PERSONAL_LETTER_SHONA_BHAI.headerTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LogoContainer customLogoUrl={logoUrl} size="sm" />
            <BrandBadge size="sm" />
          </div>
        </div>

        {/* Gift Box Unwrapping Trigger */}
        {!isOpen ? (
          <div className="py-10 flex flex-col items-center text-center space-y-4">
            <div
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#FFE4EC] to-[#F8C8DC] border-2 border-[#B98575] flex items-center justify-center text-[#54263D] shadow-[0_0_30px_rgba(239,167,196,0.35)] animate-bounce cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setIsOpen(true)}
              role="button"
              tabIndex={0}
              aria-label="Open gift box"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setIsOpen(true);
              }}
            >
              <Sparkles className="w-12 h-12 text-[#B98575]" />
            </div>
            <div className="space-y-1">
              <p className="font-serif text-xl text-[#54263D]">
                Shona Bhai ka aik shandar aur mukhlis khat aapke intezar mein hai.
              </p>
              <p className="text-xs text-[#834F6A]">
                Tap the gift box below to unwrap and read the personal letter
              </p>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-[#B98575] via-[#EFA7C4] to-[#B98575] text-[#FFFAFC] font-bold text-xs uppercase tracking-wider hover:brightness-105 active:scale-95 transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Tohfa Kholiye (Open Gift)</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Opened Letter View */
          <div className="py-6 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between">
              <span className="font-serif text-base sm:text-lg text-[#B98575] font-bold italic">
                {PERSONAL_LETTER_SHONA_BHAI.letterSalutation}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-[#834F6A] hover:text-[#54263D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Band karein</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-[#54263D] leading-relaxed font-serif bg-[#FFFAFC] p-5 sm:p-7 rounded-2xl border border-[#B98575]/25 shadow-xs">
              {PERSONAL_LETTER_SHONA_BHAI.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Signature Block */}
            <div className="pt-2 flex flex-col items-end text-right">
              <p className="text-xs text-[#834F6A] italic font-medium">
                {PERSONAL_LETTER_SHONA_BHAI.signoff}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <HeartHandshake className="w-4 h-4 text-[#B98575]" />
                <span className="font-serif font-bold text-lg text-[#54263D]">
                  {PERSONAL_LETTER_SHONA_BHAI.signature}
                </span>
              </div>
              <span className="text-[11px] text-[#B98575] uppercase tracking-widest mt-0.5 font-semibold">
                Always With Sincere Duas
              </span>
            </div>

            {/* Extra Decorative Keepsake Cards */}
            <div className="pt-6 border-t border-[#B98575]/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#54263D]">
                <Mail className="w-4 h-4 text-[#B98575]" />
                <span>Extra Keepsake Notes from Shona Bhai:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {extraKeepsakes.map((k) => {
                  const Icon = k.icon;
                  return (
                    <button
                      key={k.id}
                      onClick={() => setSelectedKeepsake(selectedKeepsake === k.id ? null : k.id)}
                      className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        selectedKeepsake === k.id
                          ? 'bg-[#FFE4EC] border-[#B98575] shadow-xs'
                          : 'bg-[#FFFAFC] border-[#B98575]/25 hover:border-[#B98575]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-serif text-xs font-bold text-[#54263D]">
                          {k.title}
                        </span>
                        <Icon className="w-3.5 h-3.5 text-[#B98575]" />
                      </div>
                      <p className="text-[11px] text-[#834F6A] mb-2 font-medium">
                        {k.subtitle}
                      </p>
                      {selectedKeepsake === k.id && (
                        <p className="text-xs text-[#54263D] pt-2 border-t border-[#B98575]/20 italic animate-in fade-in duration-200 font-serif">
                          "{k.text}"
                        </p>
                      )}
                      <span className="text-[10px] text-[#B98575] font-semibold block">
                        {selectedKeepsake === k.id ? 'Tap to close' : 'Tap to read'}
                      </span>
                    </button>
                  );
                })}
              </div>
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
                  Agli thodi si shararat shuru ho rahi hai (Aage chalein &rarr;)
                </button>
                <div className="w-48 h-1.5 bg-[#FFE4EC] rounded-full overflow-hidden border border-[#B98575]/20">
                  <div
                    className="h-full bg-gradient-to-r from-[#B98575] to-[#EFA7C4] transition-all duration-150"
                    style={{ width: `${autoProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
