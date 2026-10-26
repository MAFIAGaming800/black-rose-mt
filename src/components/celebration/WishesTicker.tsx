import React, { useState, useEffect, useMemo, useRef } from 'react';
import { FRIEND_MESSAGES, FINAL_REVEAL_NAME } from '../../config/content';
import { Sparkles, Heart, Pause, Play, Plus, X, MessageSquareHeart, ChevronRight, Check } from 'lucide-react';

export interface WishItem {
  id: string;
  name: string;
  subtitle: string;
  message: string;
  englishWish?: string;
  accent?: string;
  timestamp?: string;
  isCustom?: boolean;
}

interface WishesTickerProps {
  onProceed?: () => void;
  onHoverStateChange?: (isHovered: boolean) => void;
}

const STORAGE_KEY = 'blackrose_custom_wishes';

export const WishesTicker: React.FC<WishesTickerProps> = ({
  onProceed,
  onHoverStateChange,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [customWishes, setCustomWishes] = useState<WishItem[]>([]);
  const [selectedWish, setSelectedWish] = useState<WishItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedWishes, setLikedWishes] = useState<Record<string, boolean>>({});

  // Form states for new wish submission
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const tickerRef = useRef<HTMLDivElement>(null);

  // Load custom wishes from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCustomWishes(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Assemble full list of squad wishes
  const defaultWishes: WishItem[] = useMemo(() => {
    const list: WishItem[] = FRIEND_MESSAGES.map((f) => ({
      id: f.id,
      name: f.name,
      subtitle: f.subtitle,
      message: f.duaRomanUrdu,
      englishWish: f.englishWish,
      accent: f.accent,
    }));

    // Add Shona Bhai's heartfelt wish
    list.unshift({
      id: FINAL_REVEAL_NAME.id,
      name: FINAL_REVEAL_NAME.name,
      subtitle: FINAL_REVEAL_NAME.subtitle,
      message:
        'BLACK ROSE MT, aapko janam din bohat bohat mubarak ho! Allah Taala aapki zindagi ko dhero barkaton, izzat aur unchi bulandiyon se nawaze. Hamesha muskurati rahein!',
      englishWish: 'May you forever shine with grace, happiness, and supreme honor.',
      accent: '#B98575',
    });

    return list;
  }, []);

  const allWishes = useMemo(() => {
    return [...customWishes, ...defaultWishes];
  }, [customWishes, defaultWishes]);

  // Duplicate list to achieve a continuous horizontal loop
  const displayWishes = useMemo(() => {
    return [...allWishes, ...allWishes];
  }, [allWishes]);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleMouseEnter = () => {
    onHoverStateChange?.(true);
  };

  const handleMouseLeave = () => {
    onHoverStateChange?.(false);
  };

  const handleCardClick = (wish: WishItem) => {
    setSelectedWish(wish);
    onHoverStateChange?.(true);
  };

  const handleCloseDetail = () => {
    setSelectedWish(null);
    onHoverStateChange?.(false);
  };

  const handleToggleLike = (wishId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedWishes((prev) => ({
      ...prev,
      [wishId]: !prev[wishId],
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const trimmedName = formName.trim();
    const trimmedRole = formRole.trim() || 'Squad Well-Wisher';
    const trimmedMessage = formMessage.trim();

    if (!trimmedName) {
      setFormError('Meharbani karke apna naam darj karein.');
      return;
    }

    if (!trimmedMessage || trimmedMessage.length < 5) {
      setFormError('Meharbani karke mukhtasar dua ya wish likhein (kam az kam 5 haroof).');
      return;
    }

    // Roman Urdu / English check: Disallow non-latin Arabic/Urdu unicode range
    if (/[\u0600-\u06FF]/.test(trimmedName) || /[\u0600-\u06FF]/.test(trimmedMessage)) {
      setFormError('Meharbani karke sirf Roman Urdu ya English mein likhein.');
      return;
    }

    const newWish: WishItem = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: trimmedName,
      subtitle: trimmedRole,
      message: trimmedMessage,
      timestamp: 'Abhi shamil kiya gaya',
      isCustom: true,
      accent: '#EFA7C4',
    };

    const updated = [newWish, ...customWishes];
    setCustomWishes(updated);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // LocalStorage fallback
    }

    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setIsModalOpen(false);
      setFormName('');
      setFormRole('');
      setFormMessage('');
    }, 1200);
  };

  return (
    <section
      aria-label="Friends Birthday Wishes Ticker"
      className="w-full max-w-6xl mx-auto mt-6 px-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header Bar with Action Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5 pb-3 border-b border-[#B98575]/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#FFE4EC] border border-[#B98575]/30 flex items-center justify-center text-[#54263D] shadow-xs">
            <MessageSquareHeart className="w-5 h-5 text-[#834F6A]" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#54263D] tracking-tight">
                Squad Birthday Wishes
              </h2>
              <span className="text-[11px] font-sans font-medium text-[#834F6A] bg-[#FFE4EC] px-2 py-0.5 rounded-md border border-[#B98575]/20">
                {allWishes.length} Duayein
              </span>
            </div>
            <p className="text-xs text-[#834F6A] font-medium">
              Dosto ke mukhlisana paighamat aur pyari duayein
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Pause / Play Toggle */}
          <button
            type="button"
            onClick={togglePause}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#54263D] bg-[#FFE4EC] hover:bg-[#F8C8DC] rounded-lg border border-[#B98575]/30 transition-colors shadow-xs"
            aria-label={isPaused ? 'Resume ticker scroll' : 'Pause ticker scroll'}
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-[#54263D]" />
                <span>Play</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-[#54263D]" />
                <span>Pause</span>
              </>
            )}
          </button>

          {/* Add Wish Button */}
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(true);
              setFormError('');
              setFormSuccess(false);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#B98575] to-[#834F6A] hover:brightness-105 rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Wish Shamil Karein</span>
          </button>

          {/* Optional manual proceed to next stage */}
          {onProceed && (
            <button
              type="button"
              onClick={onProceed}
              className="hidden md:flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#834F6A] hover:text-[#54263D] hover:bg-[#FFE4EC]/60 rounded-lg transition-colors border border-transparent hover:border-[#B98575]/20"
            >
              <span>Squad Duas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Marquee Scroller Viewport with Faded Edge Scrims */}
      <div className="relative overflow-hidden rounded-2xl py-2">
        {/* Left edge fade scrim */}
        <div
          className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#FFF0F5] to-transparent z-10 pointer-events-none"
          aria-hidden="true"
        />

        {/* Right edge fade scrim */}
        <div
          className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#FFF0F5] to-transparent z-10 pointer-events-none"
          aria-hidden="true"
        />

        {/* Moving Ticker Track */}
        <div
          ref={tickerRef}
          className={`animate-ticker flex items-stretch gap-4 ${
            isPaused ? 'ticker-paused' : ''
          }`}
          style={{ willChange: 'transform' }}
        >
          {displayWishes.map((wish, index) => {
            const isLiked = Boolean(likedWishes[wish.id]);
            const initials = wish.name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={`${wish.id}-${index}`}
                onClick={() => handleCardClick(wish)}
                className="w-[300px] sm:w-[350px] shrink-0 text-left glass-card rounded-2xl p-4 sm:p-5 border border-[#B98575]/25 hover:border-[#B98575]/60 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group/card select-none"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(wish);
                  }
                }}
                aria-label={`Read wish from ${wish.name}`}
              >
                <div>
                  {/* Top Row: Monogram, Name & Subtitle */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FFE4EC] to-[#F8C8DC] border border-[#B98575]/40 flex items-center justify-center font-cinzel font-bold text-xs text-[#54263D] shadow-2xs shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-serif font-bold text-sm text-[#54263D] truncate group-hover/card:text-[#834F6A] transition-colors">
                          {wish.name}
                        </div>
                        <div className="text-[11px] text-[#834F6A] font-medium truncate">
                          {wish.subtitle}
                        </div>
                      </div>
                    </div>

                    {/* Quick Like Reaction */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleLike(wish.id, e)}
                      aria-label="Send love to this wish"
                      className="p-1.5 rounded-full hover:bg-[#FFE4EC] text-[#B98575] hover:text-[#54263D] transition-colors shrink-0"
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isLiked
                            ? 'fill-[#EFA7C4] text-[#EFA7C4] scale-110'
                            : 'text-[#B98575] group-hover/card:scale-105'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Message Quote */}
                  <p className="text-xs sm:text-[13px] text-[#54263D]/90 font-serif leading-relaxed line-clamp-3 mb-2 italic">
                    "{wish.message}"
                  </p>
                </div>

                {/* Footer Kicker */}
                <div className="pt-2 border-t border-[#B98575]/15 flex items-center justify-between text-[11px]">
                  <span className="text-[#834F6A] italic truncate max-w-[220px]">
                    {wish.englishWish || 'Janam Din Mubarak ho!'}
                  </span>
                  <span className="text-[#B98575] font-medium shrink-0 group-hover/card:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Parhein <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Wish Modal */}
      {selectedWish && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="wish-detail-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={handleCloseDetail}
        >
          <div
            className="w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-[#B98575]/40 shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseDetail}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#FFE4EC]/80 hover:bg-[#FFE4EC] text-[#54263D] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header info */}
            <div className="flex items-center gap-3.5 mb-5 pr-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFE4EC] to-[#F8C8DC] border-2 border-[#B98575]/40 flex items-center justify-center font-cinzel font-bold text-sm text-[#54263D] shadow-xs shrink-0">
                {selectedWish.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <h3 id="wish-detail-title" className="font-serif text-xl font-bold text-[#54263D]">
                  {selectedWish.name}
                </h3>
                <div className="text-xs text-[#834F6A] font-medium">
                  {selectedWish.subtitle}
                </div>
              </div>
            </div>

            {/* Dua / Wish text in Roman Urdu */}
            <div className="bg-[#FFE4EC]/40 rounded-2xl p-5 border border-[#B98575]/20 mb-4">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-[#834F6A]">
                <Sparkles className="w-3.5 h-3.5 text-[#B98575]" />
                <span>Roman Urdu Paighaam</span>
              </div>
              <p className="font-serif text-sm sm:text-base text-[#54263D] leading-relaxed">
                "{selectedWish.message}"
              </p>
            </div>

            {/* English translation / message */}
            {selectedWish.englishWish && (
              <div className="text-xs sm:text-sm text-[#834F6A] font-serif italic mb-6 px-1">
                "{selectedWish.englishWish}"
              </div>
            )}

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#B98575]/20">
              <button
                type="button"
                onClick={(e) => handleToggleLike(selectedWish.id, e)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  likedWishes[selectedWish.id]
                    ? 'bg-[#FFE4EC] text-[#54263D] border border-[#B98575]/40'
                    : 'bg-[#FFE4EC]/60 hover:bg-[#FFE4EC] text-[#834F6A]'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    likedWishes[selectedWish.id] ? 'fill-[#EFA7C4] text-[#EFA7C4]' : ''
                  }`}
                />
                <span>
                  {likedWishes[selectedWish.id] ? 'Dua Pasand Aayi' : 'Dil Bhejein'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleCloseDetail}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#54263D] hover:bg-[#3D1528] rounded-xl transition-colors shadow-xs"
              >
                Theek Hai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Wish Submission Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="submit-wish-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-7 border border-[#B98575]/40 shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#FFE4EC]/80 hover:bg-[#FFE4EC] text-[#54263D] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4 pr-6">
              <h3 id="submit-wish-title" className="font-serif text-lg sm:text-xl font-bold text-[#54263D]">
                BLACK ROSE MT Ko Wish Bhejein
              </h3>
              <p className="text-xs text-[#834F6A] mt-1">
                Aapka paighaam foran scrolling ticker mein shamil ho jayega.
              </p>
            </div>

            {formSuccess ? (
              <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FFE4EC] border-2 border-[#B98575]/50 flex items-center justify-center text-[#54263D] animate-bounce">
                  <Check className="w-6 h-6 text-[#54263D]" />
                </div>
                <div className="font-serif text-base font-bold text-[#54263D]">
                  Shukriya! Aapki Dua Shamil Ho Gayi
                </div>
                <p className="text-xs text-[#834F6A]">
                  Aapka paighaam ab ticker mein chal raha hai.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                {formError && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    {formError}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="wish-name"
                    className="block text-xs font-semibold text-[#54263D] mb-1"
                  >
                    Aapka Naam <span className="text-[#B98575]">*</span>
                  </label>
                  <input
                    id="wish-name"
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Asad Gaming ya Squad Friend"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FFE4EC]/50 border border-[#B98575]/30 rounded-xl text-[#54263D] placeholder-[#834F6A]/60 focus:outline-hidden focus:border-[#B98575] focus:bg-white"
                    maxLength={35}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="wish-role"
                    className="block text-xs font-semibold text-[#54263D] mb-1"
                  >
                    Rishta ya Tag (Optional)
                  </label>
                  <input
                    id="wish-role"
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="e.g. Gaming Partner, Loyal Fan, Bestie"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FFE4EC]/50 border border-[#B98575]/30 rounded-xl text-[#54263D] placeholder-[#834F6A]/60 focus:outline-hidden focus:border-[#B98575] focus:bg-white"
                    maxLength={40}
                  />
                </div>

                <div>
                  <label
                    htmlFor="wish-msg"
                    className="block text-xs font-semibold text-[#54263D] mb-1"
                  >
                    Aapki Dua / Wish (Roman Urdu ya English){' '}
                    <span className="text-[#B98575]">*</span>
                  </label>
                  <textarea
                    id="wish-msg"
                    rows={3}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="e.g. Janam Din Bohat Mubarak Ho! Hamesha khush raho aur gaming mein top par raho!"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FFE4EC]/50 border border-[#B98575]/30 rounded-xl text-[#54263D] placeholder-[#834F6A]/60 focus:outline-hidden focus:border-[#B98575] focus:bg-white resize-none"
                    maxLength={240}
                    required
                  />
                  <div className="flex justify-between text-[10px] text-[#834F6A] mt-1">
                    <span>Sirf Roman Urdu / English</span>
                    <span>{formMessage.length}/240</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-[#834F6A] hover:bg-[#FFE4EC] rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#B98575] to-[#834F6A] hover:brightness-105 rounded-xl transition-all shadow-xs"
                  >
                    Dua Bhejein
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
