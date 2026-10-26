import React, { useState, useEffect, useRef } from 'react';
import { Smile, Sparkles, Check, PartyPopper } from 'lucide-react';
import { MASTI_TEXT } from '../../config/content';
import { Typewriter } from '../common/Typewriter';

interface DodgingMastiProps {
  onComplete?: () => void;
}

export const DodgingMasti: React.FC<DodgingMastiProps> = ({ onComplete }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(12);
  const [isDodgingActive, setIsDodgingActive] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [showModal, setShowModal] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Dodging countdown timer (12 seconds)
  useEffect(() => {
    if (!hasStarted || !isDodgingActive) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDodgingActive(false);
            setPos({ x: 0, y: 0 }); // Settle back to center
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, isDodgingActive]);

  // When modal is dismissed (or after reading), trigger auto progression
  useEffect(() => {
    if (modalDismissed && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [modalDismissed, onComplete]);

  const handleDodge = () => {
    if (!isDodgingActive) return;
    if (!hasStarted) setHasStarted(true);

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const btnWidth = 170;
    const btnHeight = 52;

    const safeMaxX = Math.max(0, (rect.width - btnWidth) / 2 - 16);
    const safeMaxY = Math.max(0, (rect.height - btnHeight) / 2 - 20);

    const newX = (Math.random() * 2 - 1) * safeMaxX;
    const newY = (Math.random() * 2 - 1) * safeMaxY;

    setPos({ x: newX, y: newY });
  };

  const handleClick = () => {
    if (isDodgingActive) {
      handleDodge();
    } else {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalDismissed(true);
  };

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto text-center text-[#54263D]" aria-labelledby="masti-heading">
      <div className="mb-6 space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#B98575] font-semibold flex items-center justify-center gap-1.5">
          <Smile className="w-3.5 h-3.5 text-[#EFA7C4]" />
          <span>Thodi Si Shararat • Playful Interlude</span>
          <Smile className="w-3.5 h-3.5 text-[#EFA7C4]" />
        </span>
        <h2 id="masti-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#54263D]">
          Ek Choti Si Masti! 😉
        </h2>
        <p className="text-xs sm:text-sm text-[#834F6A] max-w-md mx-auto">
          Dekhte hain aap is button ko pakad sakti hain ya nahi! Try touching or clicking it.
        </p>
      </div>

      {/* The Dodging Arena (Confined Safe Area) */}
      <div
        ref={containerRef}
        className="relative w-full h-64 sm:h-72 rounded-3xl glass-card border border-[#B98575]/35 flex items-center justify-center overflow-hidden shadow-sm p-4"
      >
        {/* Arena hint and countdown banner */}
        <div className="absolute top-3 inset-x-0 flex items-center justify-center pointer-events-none">
          <span className="text-[11px] font-mono px-3.5 py-1 rounded-full bg-[#FFE4EC] border border-[#B98575]/30 text-[#54263D] font-semibold">
            {isDodgingActive
              ? hasStarted
                ? `Bhaag raha hai! ${secondsRemaining}s baki hain... 🏃‍♂️`
                : 'Button par tap/hover karein!'
              : 'Pakar lijiye! Button ruk gaya hai 🎉'}
          </span>
        </div>

        {/* The Evasive Button */}
        <button
          onClick={handleClick}
          onMouseEnter={handleDodge}
          onTouchStart={handleDodge}
          style={{
            transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
            transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className={`px-6 py-3 rounded-full font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-colors cursor-pointer flex items-center gap-2 select-none ${
            isDodgingActive
              ? 'bg-[#FFE4EC] hover:bg-[#F8C8DC] text-[#54263D] border-2 border-[#B98575]'
              : 'bg-gradient-to-r from-[#B98575] via-[#EFA7C4] to-[#B98575] text-[#FFFAFC] border-2 border-[#FFFAFC] animate-pulse shadow-[0_0_20px_rgba(239,167,196,0.6)]'
          }`}
          aria-label={isDodgingActive ? MASTI_TEXT.buttonText : MASTI_TEXT.caughtText}
        >
          <span>{isDodgingActive ? MASTI_TEXT.buttonText : MASTI_TEXT.caughtText}</span>
          {!isDodgingActive && <PartyPopper className="w-4 h-4 fill-current" />}
        </button>
      </div>

      {modalDismissed && onComplete && (
        <div className="mt-4 text-xs font-serif text-[#834F6A] animate-pulse">
          Dili duayein shuru ho rahi hain... ✨
        </div>
      )}

      {/* Affectionate Roman Urdu Modal after catching the button */}
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
                showSkip={true}
              />
            </div>

            <button
              onClick={handleCloseModal}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#B98575] via-[#EFA7C4] to-[#B98575] text-[#FFFAFC] font-bold text-xs sm:text-sm hover:brightness-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{MASTI_TEXT.buttonDismiss}</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
