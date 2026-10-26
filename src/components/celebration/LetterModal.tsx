import React, { useEffect, useRef } from 'react';
import { X, Heart, Sparkles } from 'lucide-react';
import { FriendMessage } from '../../types';
import { Typewriter } from '../common/Typewriter';

interface LetterModalProps {
  friend: FriendMessage | null;
  onClose: () => void;
}

export const LetterModal: React.FC<LetterModalProps> = ({ friend, onClose }) => {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (friend) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [friend, onClose]);

  if (!friend) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg glass-card border border-[#B98575]/40 rounded-3xl p-6 sm:p-8 shadow-[0_16px_50px_rgba(185,133,117,0.3)] text-[#54263D] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Close message"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#FFE4EC] hover:bg-[#F8C8DC] border border-[#B98575]/30 flex items-center justify-center text-[#54263D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B98575] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Sender Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#B98575]/20">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFE4EC] to-[#F8C8DC] border border-[#B98575]/60 flex items-center justify-center text-[#B98575] shadow-xs">
            <Heart className="w-5 h-5 fill-current text-[#EFA7C4]" />
          </div>
          <div>
            <h3 id="modal-title" className="font-serif text-xl sm:text-2xl font-bold text-[#54263D]">
              {friend.name}
            </h3>
            <p className="text-xs text-[#834F6A] font-semibold">
              {friend.subtitle}
            </p>
          </div>
        </div>

        {/* Heartfelt Dua in Roman Urdu with Typewriter */}
        <div id="modal-description" className="space-y-4 mb-6 leading-relaxed">
          <div className="p-4 rounded-2xl bg-[#FFFAFC] border border-[#B98575]/20 text-sm sm:text-base text-[#54263D] font-serif shadow-xs">
            <Typewriter
              text={friend.duaRomanUrdu}
              speedMs={20}
              showSkip={true}
            />
          </div>

          {/* English Kicker */}
          <div className="text-xs text-[#834F6A] italic flex items-center gap-1.5 pt-1">
            <Sparkles className="w-3.5 h-3.5 text-[#B98575] shrink-0" />
            <span>"{friend.englishWish}"</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-auto pt-4 border-t border-[#B98575]/20 flex items-center justify-between text-xs text-[#834F6A]">
          <span>With brotherly respect</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#FFE4EC] hover:bg-[#F8C8DC] border border-[#B98575]/40 text-[#54263D] text-xs font-semibold transition-colors cursor-pointer"
          >
            Band Karein (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
