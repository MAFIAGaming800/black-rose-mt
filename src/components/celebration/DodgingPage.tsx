import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PartyPopper, Sparkles, Check, Play } from 'lucide-react';
import { MASTI_TEXT } from '../../config/content';
import { Typewriter } from '../common/Typewriter';
import { getAssetPath } from '../../config/assetManifest';

interface DodgingPageProps {
  onComplete: () => void;
}

export const DodgingPage: React.FC<DodgingPageProps> = ({ onComplete }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(22); // 20-25 seconds dodging challenge
  const [isDodgingActive, setIsDodgingActive] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [showModal, setShowModal] = useState(false);
  const [isPlayingJumpScare, setIsPlayingJumpScare] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
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

  const jumpScareVideoSrc = getAssetPath('jumpScareVideo');

  // Dodging countdown timer (22 seconds)
  useEffect(() => {
    if (!hasStarted || !isDodgingActive) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDodgingActive(false);
            setPos({ x: 0, y: 0 }); // Settle stationary in center
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, isDodgingActive]);

  const handleDodge = () => {
    if (!isDodgingActive) return;
    if (!hasStarted) setHasStarted(true);

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const btnWidth = 180;
    const btnHeight = 60;

    // Strict mathematical clamping ensuring button NEVER crosses viewport boundary
    const safeMaxX = Math.max(0, (rect.width - btnWidth) / 2 - 24);
    const safeMaxY = Math.max(0, (rect.height - btnHeight) / 2 - 24);

    const newX = (Math.random() * 2 - 1) * safeMaxX;
    const newY = (Math.random() * 2 - 1) * safeMaxY;

    setPos({ x: newX, y: newY });
  };

  const handleClick = () => {
    if (isDodgingActive) {
      handleDodge();
    } else {
      if (jumpScareVideoSrc) {
        setIsPlayingJumpScare(true);
      } else {
        setShowModal(true);
      }
    }
  };

  const handleVideoEnded = () => {
    setIsPlayingJumpScare(false);
    setShowModal(true);
  };

  const handleDismissModal = () => {
    setShowModal(false);
    handleFinish();
  };

  return (
    <div className="fixed inset-0 z-30 min-h-screen bg-[#FFF0F5] text-[#54263D] flex flex-col items-center justify-center p-4 select-none">
      {/* Full-Screen Jump-Scare Video Playback if imported */}
      {isPlayingJumpScare && jumpScareVideoSrc && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={jumpScareVideoSrc}
            autoPlay
            playsInline
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* The Only Heading on Page */}
      <div className="text-center mb-8 space-y-2">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#54263D] tracking-tight">
          Ek Choti Si Masti
        </h1>
        <p className="text-xs sm:text-sm text-[#834F6A] font-serif">
          {isDodgingActive
            ? hasStarted
              ? `Button bhaag raha hai! ${secondsRemaining}s baki hain... 🏃‍♂️`
              : 'Button par tap ya cursor le kar jayein!'
            : 'Pakar lijiye! Button ruk gaya hai 🎉 Tap kar ke agay barhein!'}
        </p>
      </div>

      {/* Confined Full-Viewport Dodging Arena */}
      <div
        ref={containerRef}
        className="relative w-full max-w-2xl h-80 sm:h-96 rounded-3xl glass-card border border-[#B98575]/35 flex items-center justify-center overflow-hidden shadow-sm p-6"
      >
        {/* The Evasive Button */}
        <button
          onClick={handleClick}
          onMouseEnter={handleDodge}
          onTouchStart={handleDodge}
          style={{
            transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
            transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className={`px-8 py-3.5 rounded-full font-bold text-sm sm:text-base shadow-lg active:scale-95 transition-colors cursor-pointer flex items-center gap-2 select-none ${
            isDodgingActive
              ? 'bg-[#FFE4EC] hover:bg-[#F8C8DC] text-[#54263D] border-2 border-[#B98575]'
              : 'bg-gradient-to-r from-[#B98575] via-[#EFA7C4] to-[#B98575] text-[#FFFAFC] border-2 border-[#FFFAFC] animate-pulse shadow-[0_0_25px_rgba(239,167,196,0.6)]'
          }`}
          aria-label={isDodgingActive ? 'Pakro Mujhe! 😜' : MASTI_TEXT.caughtText}
        >
          <span>{isDodgingActive ? 'Pakro Mujhe! 😜' : 'Pakar Liya! 😄 Tap Karein'}</span>
          {!isDodgingActive && <PartyPopper className="w-5 h-5 fill-current" />}
        </button>
      </div>

      {/* Affectionate Roman Urdu Modal shown ONLY after visitor clicks stationary button */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="masti-modal-title"
        >
          <div className="relative w-full max-w-md glass-card border-2 border-[#B98575] rounded-3xl p-6 sm:p-8 text-center text-[#54263D] shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFE4EC] to-[#F8C8DC] border border-[#B98575] flex items-center justify-center mx-auto mb-4 text-[#B98575]">
              <Sparkles className="w-7 h-7 text-[#B98575]" />
            </div>

            <h3 id="masti-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-[#54263D] mb-3">
              {MASTI_TEXT.modalTitle}
            </h3>

            <div className="text-sm sm:text-base text-[#54263D] leading-relaxed mb-6 font-serif min-h-[4rem]">
              <Typewriter
                text={MASTI_TEXT.messageParagraph}
                speedMs={20}
                showSkip={false}
              />
            </div>

            <button
              onClick={handleDismissModal}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#B98575] via-[#EFA7C4] to-[#B98575] text-[#FFFAFC] font-bold text-xs sm:text-sm hover:brightness-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Three Games Challeneges Par Chalein! 🎮</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
