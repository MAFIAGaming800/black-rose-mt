import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Crown, Users, Heart, ArrowRight } from 'lucide-react';
import { SEVEN_NAMES } from '../../config/content';
import { LogoContainer } from '../common/LogoContainer';
import { BrandBadge } from '../common/BrandBadge';
import { getAssetPath } from '../../config/assetManifest';

interface FriendIntroductionsProps {
  logoUrl?: string | null;
  onComplete: () => void;
}

export const FriendIntroductions: React.FC<FriendIntroductionsProps> = ({
  logoUrl,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
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

  const totalIdentities = SEVEN_NAMES.length; // 1 (BLACK ROSE MT) + 6 Friends
  const currentIdentity = SEVEN_NAMES[currentIndex];
  const isBirthdayGirl = currentIndex === 0;

  // Auto-advance each identity with comfortable reading dwell
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < totalIdentities - 1) {
        setAnimating(true);
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setAnimating(false);
        }, 400);
      } else {
        setTimeout(() => {
          handleFinish();
        }, 800);
      }
    }, isBirthdayGirl ? 6000 : 4500);

    return () => clearTimeout(timer);
  }, [currentIndex, totalIdentities, isBirthdayGirl, handleFinish]);

  const handleManualNext = () => {
    if (animating) return;
    if (currentIndex < totalIdentities - 1) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setAnimating(false);
      }, 350);
    } else {
      handleFinish();
    }
  };

  // Resolve custom logo for each friend if imported in asset manifest
  const getFriendLogo = (friendId: string) => {
    if (friendId === 'black-rose-mt') return logoUrl || getAssetPath('brandLogo');
    if (friendId === 'primexahmed') return getAssetPath('friendLogoPrimexAhmed');
    if (friendId === 'primexhaxx') return getAssetPath('friendLogoPrimexHaxx');
    if (friendId === 'nexo-gaming') return getAssetPath('friendLogoNexoGaming');
    if (friendId === 'abhixplayz') return getAssetPath('friendLogoAbhixPlayz');
    if (friendId === 'msr') return getAssetPath('friendLogoMSR');
    if (friendId === 'vishal') return getAssetPath('friendLogoVishal');
    return null;
  };

  return (
    <section
      aria-label="Identity Introductions"
      className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 text-[#54263D] relative select-none"
    >
      {/* Background radial glow */}
      <div className="absolute w-96 h-96 bg-[#EFA7C4]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Chapter Indicator Bar */}
      <div className="mb-8 flex items-center gap-3">
        <span className="text-xs uppercase tracking-widest text-[#B98575] font-semibold flex items-center gap-1.5">
          {isBirthdayGirl ? (
            <>
              <Crown className="w-4 h-4 text-[#B98575]" />
              <span>Royal Birthday Star Identity</span>
            </>
          ) : (
            <>
              <Users className="w-4 h-4 text-[#834F6A]" />
              <span>The Squad Identity Introductions</span>
            </>
          )}
        </span>
        <span className="text-xs font-mono font-medium text-[#834F6A] bg-[#FFE4EC] px-2.5 py-0.5 rounded-full border border-[#B98575]/20">
          {currentIndex + 1} / {totalIdentities}
        </span>
      </div>

      {/* Main Identity Presentation Card */}
      <div
        className={`w-full max-w-xl glass-card rounded-3xl border border-[#B98575]/40 p-8 sm:p-12 shadow-[0_20px_60px_rgba(185,133,117,0.18)] text-center transition-all duration-500 transform ${
          animating ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        {isBirthdayGirl ? (
          /* Birthday Star Card */
          <div className="space-y-6">
            <div className="flex justify-center">
              <LogoContainer customLogoUrl={getFriendLogo(currentIdentity.id)} size="lg" />
            </div>

            <div className="space-y-2">
              <BrandBadge size="md" />
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#54263D] tracking-tight">
                {currentIdentity.name}
              </h2>
              <p className="text-sm sm:text-base text-[#B98575] font-serif font-semibold italic">
                {currentIdentity.subtitle}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#834F6A] font-serif max-w-md mx-auto leading-relaxed">
              Aaj ki shab aapki shaan, aapki izzat aur aapki roshan muskurahat ke naam hai.
              Squad ke har sathi ki taraf se dhero mubarakbaad!
            </p>
          </div>
        ) : (
          /* Squad Friend Card */
          <div className="space-y-6">
            <div className="flex justify-center">
              {getFriendLogo(currentIdentity.id) ? (
                <img
                  src={getFriendLogo(currentIdentity.id)!}
                  alt={currentIdentity.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#B98575]/50 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFE4EC] to-[#F8C8DC] border-2 border-[#B98575]/60 flex items-center justify-center font-cinzel font-bold text-2xl text-[#54263D] shadow-md">
                  {currentIdentity.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-widest text-[#B98575] font-semibold">
                Squad Pillar & Brother
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#54263D] tracking-tight">
                {currentIdentity.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#834F6A] font-serif font-medium">
                {currentIdentity.subtitle}
              </p>
            </div>

            <div className="py-2 px-4 rounded-xl bg-[#FFE4EC]/50 border border-[#B98575]/20 inline-flex items-center gap-2 text-xs text-[#54263D]">
              <Heart className="w-3.5 h-3.5 text-[#EFA7C4] fill-current" />
              <span>Dua & Loyal Friendship for BLACK ROSE MT</span>
            </div>
          </div>
        )}

        {/* Progression Controls */}
        <div className="mt-8 pt-6 border-t border-[#B98575]/20 flex items-center justify-between">
          <div className="flex gap-1.5">
            {SEVEN_NAMES.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-6 bg-[#B98575]'
                    : i < currentIndex
                    ? 'w-2 bg-[#EFA7C4]'
                    : 'w-2 bg-[#FFE4EC]'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleManualNext}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#834F6A] hover:text-[#54263D] transition-colors cursor-pointer group"
          >
            <span>
              {currentIndex < totalIdentities - 1 ? 'Agli Pehchan' : 'Reveal Hero Par Chalein'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
