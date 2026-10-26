import React from 'react';
import { Volume2, ShieldCheck, Clock, Sparkles, Heart } from 'lucide-react';
import { CountdownState } from '../../hooks/useServerTime';
import { BrandBadge } from '../common/BrandBadge';
import { Typewriter } from '../common/Typewriter';

interface CountdownViewProps {
  countdown: CountdownState;
  portraitUrl?: string | null;
  logoUrl?: string | null;
  hasAudioPermission: boolean;
  onGrantAudio: () => void;
  onOpenAdmin: () => void;
  onManualTriggerFallback?: () => void;
}

export const CountdownView: React.FC<CountdownViewProps> = ({
  countdown,
  logoUrl,
  hasAudioPermission,
  onGrantAudio,
  onOpenAdmin,
  onManualTriggerFallback,
}) => {
  const padZero = (n: number) => Math.max(0, n).toString().padStart(2, '0');

  // Check if target deadline is reached or unlocked in preview
  const isTargetReached =
    countdown.isUnlocked ||
    (countdown.totalRemainingMs <= 0 && !countdown.isLoading);

  // Exact original BLACK ROSE MT logo asset path
  const primaryLogoSrc = logoUrl || '/assets/logo.png';

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between px-4 py-8 max-w-4xl mx-auto z-10 text-center text-[#54263D]">
      {/* Top Bar with Brand Badge and Admin Shortcut */}
      <header className="w-full flex items-center justify-between gap-4 pt-2">
        <BrandBadge size="sm" />
        <button
          onClick={onOpenAdmin}
          aria-label="Open Admin Settings"
          className="text-xs px-3.5 py-1.5 rounded-full bg-[#FFFAFC] hover:bg-[#FFE4EC] border border-[#B98575]/40 text-[#54263D] transition-colors shadow-sm font-medium cursor-pointer"
        >
          Admin
        </button>
      </header>

      {/* Main Countdown Hero */}
      <main className="my-auto py-6 flex flex-col items-center w-full">
        {/* Exact Original BLACK ROSE MT Logo restored directly above the countdown */}
        <div className="relative mb-5 flex items-center justify-center group">
          <div className="relative p-2 rounded-full bg-[#FFFAFC]/90 backdrop-blur-sm border border-[#B98575]/40 shadow-[0_12px_36px_rgba(185,133,117,0.22)] transition-transform duration-300 hover:scale-105 overflow-hidden">
            <img
              src={primaryLogoSrc}
              alt="Official BLACK ROSE MT Logo"
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 object-contain select-none drop-shadow-md"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('logo.png')) {
                  target.src = '/assets/logo.png';
                }
              }}
            />
          </div>
        </div>

        {/* Brand Title and Roman Urdu Opening Subtitle */}
        <div className="space-y-2 mb-6 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm tracking-widest uppercase text-[#B98575] font-semibold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#EFA7C4]" />
            <span>17 November 2026 • 12:00 AM PKT (Asia/Karachi, UTC+05:00)</span>
            <Sparkles className="w-3.5 h-3.5 text-[#EFA7C4]" />
          </p>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#54263D] drop-shadow-sm">
            Happy Birthday <br />
            <span className="shimmer-text">BLACK ROSE MT</span>
          </h1>

          <div className="max-w-xl mx-auto pt-2 text-sm sm:text-base text-[#834F6A] min-h-[3rem] font-serif leading-relaxed">
            <Typewriter
              text="Waqt tham sa gaya hai... ek azeem aur roshan din ki taraf safar jari hai. Aapke janam din ke khaas lamhat ka intezar hai!"
              speedMs={30}
              showSkip={false}
            />
          </div>
        </div>

        {/* Tabular Server-Verified Countdown Glass Card */}
        <div className="w-full max-w-xl glass-card rounded-3xl p-5 sm:p-7 shadow-[0_16px_50px_rgba(185,133,117,0.2)] border border-[#B98575]/35 bg-[#FFFAFC]/85 backdrop-blur-md">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#B98575] font-semibold mb-4">
            <Clock className="w-3.5 h-3.5" />
            <span>Pakistan Standard Time (Asia/Karachi, UTC+05:00)</span>
          </div>

          {/* Graceful status when countdown completes / unlocks */}
          {isTargetReached ? (
            <div className="py-6 px-4 text-center space-y-3 bg-[#FFE4EC]/70 rounded-2xl border border-[#B98575]/30 animate-in zoom-in-95 duration-500">
              <div className="w-12 h-12 rounded-full bg-[#EFA7C4]/20 border border-[#B98575] mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#54263D] animate-spin" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#54263D]">
                Aapka Khaas Din Aa Gaya Hai! 🎂✨
              </h3>
              <p className="text-xs sm:text-sm text-[#834F6A] font-serif">
                The moment of celebration has arrived for BLACK ROSE MT.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:gap-4 font-mono">
              {/* DAYS */}
              <div className="bg-[#FFF0F5]/90 border border-[#B98575]/30 rounded-2xl p-2.5 sm:p-4 flex flex-col items-center shadow-xs transition-transform hover:scale-105">
                <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#54263D] tabular-nums drop-shadow-xs">
                  {Math.max(0, countdown.days)}
                </span>
                <span className="text-[10px] sm:text-xs font-sans text-[#834F6A] uppercase tracking-wider mt-1 font-semibold">
                  Days
                </span>
              </div>

              {/* HOURS */}
              <div className="bg-[#FFF0F5]/90 border border-[#B98575]/30 rounded-2xl p-2.5 sm:p-4 flex flex-col items-center shadow-xs transition-transform hover:scale-105">
                <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#54263D] tabular-nums drop-shadow-xs">
                  {padZero(countdown.hours)}
                </span>
                <span className="text-[10px] sm:text-xs font-sans text-[#834F6A] uppercase tracking-wider mt-1 font-semibold">
                  Hours
                </span>
              </div>

              {/* MINUTES */}
              <div className="bg-[#FFF0F5]/90 border border-[#B98575]/30 rounded-2xl p-2.5 sm:p-4 flex flex-col items-center shadow-xs transition-transform hover:scale-105">
                <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#54263D] tabular-nums drop-shadow-xs">
                  {padZero(countdown.minutes)}
                </span>
                <span className="text-[10px] sm:text-xs font-sans text-[#834F6A] uppercase tracking-wider mt-1 font-semibold">
                  Minutes
                </span>
              </div>

              {/* SECONDS */}
              <div className="bg-[#FFF0F5]/90 border border-[#B98575]/30 rounded-2xl p-2.5 sm:p-4 flex flex-col items-center shadow-xs transition-transform hover:scale-105">
                <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#B98575] tabular-nums drop-shadow-xs">
                  {padZero(countdown.seconds)}
                </span>
                <span className="text-[10px] sm:text-xs font-sans text-[#834F6A] uppercase tracking-wider mt-1 font-semibold">
                  Seconds
                </span>
              </div>
            </div>
          )}

          {/* Security & Server Status */}
          <div className="mt-4 pt-3 border-t border-[#B98575]/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#834F6A]">
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Server-Authoritative Time Verified</span>
            </div>
            {countdown.isTampered && (
              <span className="text-amber-800 font-semibold px-2 py-0.5 rounded bg-amber-100 border border-amber-300">
                Device clock difference detected • Verified by server
              </span>
            )}
            {countdown.isPreview && (
              <span className="text-amber-900 font-semibold px-2 py-0.5 rounded bg-amber-100 border border-amber-300">
                Admin Test Simulation Active
              </span>
            )}
          </div>
        </div>

        {/* Audio Permission Button & Fallback Action */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          {!hasAudioPermission ? (
            <button
              onClick={onGrantAudio}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#B98575] via-[#EFA7C4] to-[#B98575] text-[#FFFAFC] font-semibold text-xs sm:text-sm shadow-md hover:brightness-105 transition-all active:scale-95 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 fill-current" />
              <span>Tap to Enable Audio Ambience 🎵</span>
            </button>
          ) : (
            <span className="text-xs text-[#834F6A] flex items-center gap-1.5 py-1 font-medium bg-[#FFFAFC]/80 px-3.5 py-1.5 rounded-full border border-[#B98575]/30">
              <Heart className="w-3.5 h-3.5 text-[#EFA7C4] fill-current" />
              <span>Audio ambience prepared for birthday reveal</span>
            </span>
          )}

          {/* Manual Unlock / Fallback Button */}
          {(countdown.isUnlocked || countdown.isPreview) && onManualTriggerFallback && (
            <button
              onClick={onManualTriggerFallback}
              className="px-6 py-2.5 rounded-full bg-[#FFFAFC] hover:bg-[#FFE4EC] border border-[#B98575]/60 text-[#54263D] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Start Birthday Experience ✨
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-xs text-[#834F6A]/80 pt-4">
        <span>BLACK ROSE MT Birthday Celebration • Presented by Shona Bhai with duas & respect</span>
      </footer>
    </div>
  );
};
