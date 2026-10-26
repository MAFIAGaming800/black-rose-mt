import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mail, Send, Heart, CheckCircle2 } from 'lucide-react';
import { FRIEND_MESSAGES } from '../../config/content';
import { FriendMessage } from '../../types';
import { LetterModal } from './LetterModal';

interface EnvelopeGridProps {
  onComplete?: () => void;
}

export const EnvelopeGrid: React.FC<EnvelopeGridProps> = ({ onComplete }) => {
  const [selectedFriend, setSelectedFriend] = useState<FriendMessage | null>(null);
  const [openedIds, setOpenedIds] = useState<Set<string>>(new Set());
  const [allReadNotification, setAllReadNotification] = useState(false);
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

  const handleOpenFriend = (friend: FriendMessage) => {
    setSelectedFriend(friend);
    const nextOpened = new Set(openedIds);
    nextOpened.add(friend.id);
    setOpenedIds(nextOpened);

    // If this completes all 6 envelopes, trigger auto advance
    if (nextOpened.size === FRIEND_MESSAGES.length && onComplete) {
      setAllReadNotification(true);
      setTimeout(() => {
        handleAdvance();
      }, 3000);
    }
  };

  return (
    <section className="py-16 px-4 max-w-5xl mx-auto text-[#54263D]" aria-labelledby="envelopes-heading">
      <div className="text-center mb-10 space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#B98575] font-semibold flex items-center justify-center gap-1.5">
          <Heart className="w-3.5 h-3.5 fill-current text-[#EFA7C4]" />
          <span>Dosto Ki Dua-e-Khaas • Squad Messages</span>
          <Heart className="w-3.5 h-3.5 fill-current text-[#EFA7C4]" />
        </span>
        <h2 id="envelopes-heading" className="font-serif text-3xl sm:text-4xl font-bold text-[#54263D]">
          Heartfelt Envelopes for BLACK ROSE MT
        </h2>
        <p className="text-xs sm:text-sm text-[#834F6A] max-w-lg mx-auto leading-relaxed">
          Har lifafa aapke liye aik mukhlis dua aur dili paighaam rakhta hai. Lifafay par click kar ke dua parhein!
        </p>

        {/* Read Tracker Badge */}
        <div className="pt-2 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#FFE4EC] border border-[#B98575]/30 text-xs font-semibold text-[#54263D]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Khole gaye lifafay: {openedIds.size} / {FRIEND_MESSAGES.length}</span>
          </span>
        </div>

        {allReadNotification && (
          <div className="mt-3 text-xs text-emerald-700 font-semibold animate-pulse flex items-center justify-center gap-1.5">
            <span>✨ Saare dosto ki duayein parh li gayin! Agla khaas tohfa khul raha hai...</span>
          </div>
        )}
      </div>

      {/* Grid of 6 envelopes with dimensional envelope design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {FRIEND_MESSAGES.map((friend) => {
          const isOpened = openedIds.has(friend.id);
          return (
            <div
              key={friend.id}
              className={`group relative flex flex-col justify-between rounded-3xl glass-card border transition-all duration-300 hover:-translate-y-1.5 overflow-hidden shadow-sm hover:shadow-md ${
                isOpened
                  ? 'border-[#B98575]/60 bg-[#FFFAFC]'
                  : 'border-[#B98575]/25 hover:border-[#B98575]/50'
              }`}
            >
              {/* Top Envelope Flap with Wax Seal */}
              <div className="relative w-full h-14 bg-gradient-to-b from-[#FFE4EC] to-[#F8C8DC] border-b border-[#B98575]/25 flex items-center justify-center">
                {/* Triangular flap fold decoration */}
                <div className="absolute inset-x-0 bottom-0 h-0 border-l-[140px] sm:border-l-[160px] border-l-transparent border-r-[140px] sm:border-r-[160px] border-r-transparent border-t-[18px] border-t-[#FFE4EC] pointer-events-none opacity-80" />

                {/* Glowing Wax Seal */}
                <div className="relative z-10 w-9 h-9 rounded-full bg-gradient-to-br from-[#B98575] via-[#EFA7C4] to-[#B98575] border-2 border-[#FFFAFC] flex items-center justify-center text-[#FFFAFC] shadow-md group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4 fill-current text-[#FFFAFC]" />
                </div>
              </div>

              {/* Envelope Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#B98575] font-semibold">
                      Wax-Sealed Dua
                    </span>
                    {isOpened && (
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Parha gaya
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#54263D] group-hover:text-[#B98575] transition-colors">
                    {friend.name}
                  </h3>
                  <p className="text-xs text-[#834F6A] font-medium">
                    {friend.subtitle}
                  </p>
                </div>

                {/* Snippet Preview */}
                <div className="p-3 rounded-xl bg-[#FFE4EC]/50 border border-[#B98575]/20 text-[11px] text-[#54263D]/80 italic line-clamp-2 font-serif">
                  "{friend.duaRomanUrdu.slice(0, 75)}..."
                </div>

                {/* Clear "Click to Open" CTA */}
                <button
                  onClick={() => handleOpenFriend(friend)}
                  aria-label={`Click to Open letter from ${friend.name}`}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFE4EC] via-[#F8C8DC] to-[#FFE4EC] hover:from-[#B98575] hover:to-[#EFA7C4] hover:text-[#FFFAFC] border border-[#B98575]/40 text-[#54263D] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
                >
                  <span>{isOpened ? 'Dobara Parhein' : 'Click to Open'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for selected friend letter with backdrop blur */}
      <LetterModal
        friend={selectedFriend}
        onClose={() => setSelectedFriend(null)}
      />
    </section>
  );
};
