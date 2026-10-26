import { useState, useEffect, useCallback, useRef } from 'react';
import { CelebrationStage, UploadedAssets } from './types';
import { useServerTime } from './hooks/useServerTime';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { ParticleCanvas } from './components/common/ParticleCanvas';
import { CountdownView } from './components/countdown/CountdownView';
import { CountdownVideoTransition } from './components/transition/CountdownVideoTransition';
import { BlackScreenAudio } from './components/transition/BlackScreenAudio';
import { CakeStage } from './components/ceremony/CakeStage';
import { FriendIntroductions } from './components/celebration/FriendIntroductions';
import { RevealHero } from './components/celebration/RevealHero';
import { WishesTicker } from './components/celebration/WishesTicker';
import { EnvelopeGrid } from './components/celebration/EnvelopeGrid';
import { SpecialGift } from './components/celebration/SpecialGift';
import { DodgingPage } from './components/celebration/DodgingPage';
import { GamesContainer } from './components/games/GamesContainer';
import { SkyFullOfDuas } from './components/celebration/SkyFullOfDuas';
import { ShonaBhaiLetter } from './components/celebration/ShonaBhaiLetter';
import { DuasSection } from './components/celebration/DuasSection';
import { EmotionalClosing } from './components/celebration/EmotionalClosing';
import { ReplayScreen } from './components/celebration/ReplayScreen';
import { MusicDock } from './components/audio/MusicDock';
import { AdminModal } from './components/admin/AdminModal';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [stage, setStage] = useState<CelebrationStage>('COUNTDOWN');
  const [previewToken, setPreviewToken] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [assets, setAssets] = useState<UploadedAssets>({ logo: null, portrait: null, video: null });
  const [isWishesTickerActive, setIsWishesTickerActive] = useState(false);

  // Server-authoritative time and anti-tamper monotonic clock hook
  const countdown = useServerTime(previewToken);

  // YouTube Audio Engine hook for Birthday Song (sqkzN2Ye_pk)
  const player = useYouTubePlayer();
  const playerRef = useRef(player);
  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  // Fetch initial uploaded assets
  useEffect(() => {
    fetch('/api/admin/assets')
      .then((res) => res.json())
      .then((data) => {
        setAssets({
          logo: data.logo || null,
          portrait: data.portrait || null,
          video: data.video || null,
        });
      })
      .catch(() => {
        // Fallback: no custom assets
      });
  }, []);

  // Strict transition trigger:
  // In 30-second preview mode: triggers when 20 seconds remain on monotonic timer (at t=10s)
  // In production mode: strictly requires server-verified isUnlocked! Public deadline NEVER changes.
  useEffect(() => {
    if (stage === 'COUNTDOWN' || stage === 'WELCOME' || stage === 'GATE_ANIMATION') {
      if (countdown.isPreview) {
        if (countdown.totalRemainingMs <= 20000 && !countdown.isLoading) {
          setStage('MEDIA_COUNTDOWN_VIDEO');
        }
      } else if (countdown.isUnlocked && !countdown.isLoading) {
        setStage('MEDIA_COUNTDOWN_VIDEO');
      }
    }
  }, [stage, countdown.totalRemainingMs, countdown.isLoading, countdown.isPreview, countdown.isUnlocked]);

  // Video transition complete -> move to Black Screen Audio Interlude (5-6s)
  const handleVideoComplete = useCallback(() => {
    setStage('BLACK_SCREEN_AUDIO');
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // Ignored
    }
  }, []);

  // Black screen audio complete -> start birthday song and move directly to Cake Ceremony
  // Wrapped in try/catch to ensure audio restrictions NEVER block or freeze scene transition
  const handleBlackScreenComplete = useCallback(() => {
    setStage('CAKE_CEREMONY');
    try {
      playerRef.current?.playBirthdaySong();
    } catch (err) {
      console.warn('Birthday song playback blocked or deferred:', err);
    }
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // Ignored
    }
  }, []);

  // Cake Ceremony complete -> move to Friend Introductions (Section 7)
  const handleCakeComplete = useCallback(() => {
    setStage('FRIEND_INTRODUCTIONS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Friend Introductions complete -> move to Birthday Reveal Hero (Section 14 & Reveal Hero)
  const handleIntroductionsComplete = useCallback(() => {
    setStage('BIRTHDAY_REVEAL');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Birthday Reveal Hero complete -> move to Squad Envelopes (Section 8)
  const handleRevealComplete = useCallback(() => {
    setStage('ENVELOPE_GRID');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Squad Envelopes complete (all 6 opened & read) -> move to Special Gift (Section 9 Shona Bhai grand entry)
  const handleEnvelopesComplete = useCallback(() => {
    setStage('SPECIAL_GIFT');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Special Gift complete -> move to dedicated full-screen Dodging Page (Section 10 Ek Choti Si Masti)
  const handleGiftComplete = useCallback(() => {
    setStage('DODGING_PAGE');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Dodging Page complete -> move to Three Games (Section 11)
  const handleMastiComplete = useCallback(() => {
    setStage('GAMES');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Games complete -> move to Sky Full of Duas (Section 12)
  const handleGamesComplete = useCallback(() => {
    setStage('SKY_FULL_OF_DUAS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Sky Full of Duas complete -> move to Shona Bhai Letter (Section 13, strictly NO video)
  const handleSkyDuasComplete = useCallback(() => {
    setStage('SHONA_BHAI_LETTER');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Shona Bhai Letter complete -> move to Emotional Brotherly Closing (Section 15)
  const handleShonaLetterComplete = useCallback(() => {
    setStage('EMOTIONAL_CLOSING');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Emotional Closing complete -> move to Final Finale (Option C climax & 3D Thank You, Section 14 & 15)
  const handleClosingComplete = useCallback(() => {
    setStage('FINAL_FINALE');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Safe replay handler (Available strictly on final screen)
  const handleReplay = useCallback(() => {
    player.stopAll();
    setPreviewToken(null);
    setStage('COUNTDOWN');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [player]);

  // Admin 30-second preview launch
  const handleStart30sPreview = useCallback((token: string) => {
    player.stopAll();
    setPreviewToken(token);
    setStage('COUNTDOWN');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [player]);

  // Subtle story journey progress stepper for celebration stages
  const storyChapters: { stage: CelebrationStage; label: string }[] = [
    { stage: 'CAKE_CEREMONY', label: '1. Barbie Cake' },
    { stage: 'FRIEND_INTRODUCTIONS', label: '2. Identity Reveals' },
    { stage: 'BIRTHDAY_REVEAL', label: '3. Birthday Star' },
    { stage: 'ENVELOPE_GRID', label: '4. Squad Duas' },
    { stage: 'SPECIAL_GIFT', label: '5. Khaas Tohfa' },
    { stage: 'DODGING_PAGE', label: '6. Masti' },
    { stage: 'GAMES', label: '7. Games Challenge' },
    { stage: 'SKY_FULL_OF_DUAS', label: '8. Sky of Duas 🌙' },
    { stage: 'SHONA_BHAI_LETTER', label: '9. Bhai Ka Letter' },
    { stage: 'EMOTIONAL_CLOSING', label: '10. Bhai Ka Rishta' },
    { stage: 'FINAL_FINALE', label: '11. Grand Finale' },
  ];

  const currentChapterIndex = storyChapters.findIndex((c) => c.stage === stage);
  const showNav =
    currentChapterIndex !== -1 &&
    stage !== 'DODGING_PAGE' &&
    stage !== 'BLACK_SCREEN_AUDIO' &&
    stage !== 'MEDIA_COUNTDOWN_VIDEO';

  return (
    <div className="relative min-h-screen bg-[#FFF0F5] text-[#54263D] overflow-x-hidden selection:bg-[#EFA7C4]/40 selection:text-[#54263D]">
      {/* Floating Petals Canvas & Finale Confetti Explosion */}
      {stage !== 'BLACK_SCREEN_AUDIO' && stage !== 'MEDIA_COUNTDOWN_VIDEO' && (
        <ParticleCanvas
          density={35}
          stage={stage}
          isFinale={stage === 'FINAL_FINALE'}
        />
      )}

      {/* Hidden YouTube IFrame Container for Birthday Anthem Playback via official IFrame API */}
      <div className="sr-only pointer-events-none w-1 h-1 overflow-hidden" aria-hidden="true">
        <div id="yt-birthday-player-container" />
      </div>

      {/* Top Chapter Breadcrumb Bar */}
      {showNav && (
        <nav
          aria-label="Story Progression"
          className="sticky top-0 z-40 bg-[#FFF0F5]/85 backdrop-blur-md border-b border-[#B98575]/20 py-2.5 px-4 shadow-xs"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B98575] animate-pulse" />
              <span className="font-cinzel font-bold text-[#54263D] uppercase tracking-wider text-[11px] sm:text-xs">
                BLACK ROSE MT Celebration
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#834F6A] font-medium">
              <span className="hidden sm:inline">Chapter {currentChapterIndex + 1} of {storyChapters.length}:</span>
              <span className="font-semibold text-[#54263D] bg-[#FFE4EC] px-2.5 py-0.5 rounded-full border border-[#B98575]/30">
                {storyChapters[currentChapterIndex]?.label}
              </span>
              <Heart className="w-3 h-3 text-[#EFA7C4] fill-current" />
            </div>
          </div>
        </nav>
      )}

      {/* 1. Countdown Stage (Fixed 17 Nov 2026, 00:00 Asia/Karachi) */}
      {stage === 'COUNTDOWN' && (
        <CountdownView
          countdown={countdown}
          portraitUrl={assets.portrait}
          logoUrl={assets.logo}
          hasAudioPermission={player.hasAudioPermission}
          onGrantAudio={player.grantAudioPermission}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onManualTriggerFallback={
            countdown.isPreview || countdown.isUnlocked
              ? () => setStage('MEDIA_COUNTDOWN_VIDEO')
              : undefined
          }
        />
      )}

      {/* 2. Media Countdown Video (MP4 / embed synchronized, NO skip buttons) */}
      {stage === 'MEDIA_COUNTDOWN_VIDEO' && (
        <CountdownVideoTransition
          videoUrl={assets.video}
          onVideoComplete={handleVideoComplete}
        />
      )}

      {/* 3. Pure Black Screen Audio Interlude (5-6s of -EMmxkqvoPQ, NO text/visuals/skip) */}
      {stage === 'BLACK_SCREEN_AUDIO' && (
        <BlackScreenAudio onComplete={handleBlackScreenComplete} />
      )}

      {/* 4. Cake Ceremony (Barbie-doll cake on decorated trolley with wheels, candles with smoke, multi-direction swipe cut) */}
      {stage === 'CAKE_CEREMONY' && (
        <CakeStage onCeremonyComplete={handleCakeComplete} />
      )}

      {/* 5. Friend Introductions & Identity Reveals (Section 7: First BLACK ROSE MT, then 6 friends) */}
      {stage === 'FRIEND_INTRODUCTIONS' && (
        <main className="relative z-10 py-8">
          <FriendIntroductions
            logoUrl={assets.logo}
            onComplete={handleIntroductionsComplete}
          />
        </main>
      )}

      {/* 6. Birthday Reveal Hero & Squad Wishes Scrolling Ticker */}
      {stage === 'BIRTHDAY_REVEAL' && (
        <main className="relative z-10 py-8">
          <RevealHero
            logoUrl={assets.logo}
            onComplete={handleRevealComplete}
            isPaused={isWishesTickerActive}
          />
          <WishesTicker
            onProceed={handleRevealComplete}
            onHoverStateChange={setIsWishesTickerActive}
          />
        </main>
      )}

      {/* 7. Squad Envelopes (Auto-advances when all 6 opened) */}
      {stage === 'ENVELOPE_GRID' && (
        <main className="relative z-10 py-8">
          <EnvelopeGrid onComplete={handleEnvelopesComplete} />
        </main>
      )}

      {/* 8. Special Gift */}
      {stage === 'SPECIAL_GIFT' && (
        <main className="relative z-10 py-8">
          <SpecialGift logoUrl={assets.logo} onComplete={handleGiftComplete} />
        </main>
      )}

      {/* 9. Separate Full-Screen Dodging Page (Dodges 20-25s in viewport, then jump-scare/transition to games) */}
      {stage === 'DODGING_PAGE' && (
        <DodgingPage onComplete={handleMastiComplete} />
      )}

      {/* 10. Three Playable Games (Section 11) */}
      {stage === 'GAMES' && (
        <main className="relative z-10 py-8">
          <GamesContainer onComplete={handleGamesComplete} />
        </main>
      )}

      {/* 11. A Sky Full of Duas (Section 12: 4 separate full-screen scenes) */}
      {stage === 'SKY_FULL_OF_DUAS' && (
        <SkyFullOfDuas onComplete={handleSkyDuasComplete} />
      )}

      {/* 12. From Shona Bhai, With Duas (Section 13: Strictly NO video) */}
      {stage === 'SHONA_BHAI_LETTER' && (
        <ShonaBhaiLetter onComplete={handleShonaLetterComplete} />
      )}

      {/* 13. Sincere Duas (Fallback backward compatibility) */}
      {stage === 'DUAS_SECTION' && (
        <main className="relative z-10 py-8">
          <DuasSection onComplete={handleClosingComplete} />
        </main>
      )}

      {/* 14. Emotional Brotherly Closing */}
      {stage === 'EMOTIONAL_CLOSING' && (
        <main className="relative z-10 py-8">
          <EmotionalClosing onComplete={handleClosingComplete} />
        </main>
      )}

      {/* 15. Grand Finale & Replay (Both exact sign-offs, ONLY screen with Replay button) */}
      {stage === 'FINAL_FINALE' && (
        <main className="relative z-10 py-8 pb-24">
          <ReplayScreen logoUrl={assets.logo} onReplay={handleReplay} />
        </main>
      )}

      {/* Persistent Floating Music Controller (Active after video & black screen sequence) */}
      {stage !== 'COUNTDOWN' &&
        stage !== 'MEDIA_COUNTDOWN_VIDEO' &&
        stage !== 'BLACK_SCREEN_AUDIO' && <MusicDock player={player} />}

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onStart20sPreview={handleStart30sPreview}
        onAssetsUpdated={(newAssets) => setAssets({ ...newAssets, video: assets.video })}
      />
    </div>
  );
}
