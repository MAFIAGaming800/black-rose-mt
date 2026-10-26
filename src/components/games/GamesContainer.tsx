import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Gamepad2, Sparkles, Trophy, ArrowRight, Star } from 'lucide-react';
import { TrickDoorGame } from './TrickDoorGame';
import { MemoryTrapGame } from './MemoryTrapGame';
import { MindTrapGame } from './MindTrapGame';

interface GamesContainerProps {
  onComplete: () => void;
}

type GamePhase = 'INTRO' | 'GAME_1' | 'GAME_2' | 'GAME_3' | 'ALL_COMPLETE';

export const GamesContainer: React.FC<GamesContainerProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<GamePhase>('INTRO');
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

  return (
    <section
      aria-label="Birthday Games Challenge"
      className="py-12 px-4 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[75vh]"
    >
      {/* Phase 1: Cinematic Intro */}
      {phase === 'INTRO' && (
        <div className="w-full max-w-xl glass-card rounded-3xl border border-[#B98575]/40 p-8 sm:p-12 shadow-[0_20px_60px_rgba(185,133,117,0.18)] text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFE4EC] to-[#F8C8DC] border border-[#B98575]/60 flex items-center justify-center mx-auto text-[#54263D] shadow-md animate-bounce">
            <Gamepad2 className="w-8 h-8 text-[#54263D]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#B98575] font-semibold flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#EFA7C4]" />
              <span>Section 4 • Shahi Khel & Challenges</span>
              <Sparkles className="w-3.5 h-3.5 text-[#EFA7C4]" />
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#54263D]">
              Three Playable Games
            </h2>
            <p className="text-xs sm:text-sm text-[#834F6A] font-serif max-w-md mx-auto leading-relaxed">
              BLACK ROSE MT, aapke liye 3 shandar dimaghi challenges tayyar kiye gaye hain!
              Har challenge jeet kar aage barhein aur shahi duayein unlock karein!
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-serif text-[#834F6A] pt-2">
            <div className="p-2.5 rounded-xl bg-[#FFE4EC]/60 border border-[#B98575]/20">
              <span className="block font-bold text-[#54263D]">1. Trick Door</span>
              <span className="text-[10px] text-[#B98575]">Sahi Darwaza</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FFE4EC]/60 border border-[#B98575]/20">
              <span className="block font-bold text-[#54263D]">2. Memory Trap</span>
              <span className="text-[10px] text-[#B98575]">Yaad Hai Ya Nahi?</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FFE4EC]/60 border border-[#B98575]/20">
              <span className="block font-bold text-[#54263D]">3. Mind Trap</span>
              <span className="text-[10px] text-[#B98575]">Dimagh Ka Dhoka</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPhase('GAME_1')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#B98575] via-[#EFA7C4] to-[#B98575] text-white font-bold text-sm tracking-wide hover:brightness-105 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mx-auto"
          >
            <span>Khel Shuru Karein! 🎮</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Phase 2: Game 1 — The Trick Door */}
      {phase === 'GAME_1' && (
        <TrickDoorGame onGameComplete={() => setPhase('GAME_2')} />
      )}

      {/* Phase 3: Game 2 — Memory Trap */}
      {phase === 'GAME_2' && (
        <MemoryTrapGame onGameComplete={() => setPhase('GAME_3')} />
      )}

      {/* Phase 4: Game 3 — Don't Trust Your Eyes */}
      {phase === 'GAME_3' && (
        <MindTrapGame onGameComplete={() => setPhase('ALL_COMPLETE')} />
      )}

      {/* Phase 5: All Complete Victory Screen */}
      {phase === 'ALL_COMPLETE' && (
        <div className="w-full max-w-xl glass-card rounded-3xl border border-[#B98575]/40 p-8 sm:p-12 shadow-[0_20px_60px_rgba(185,133,117,0.18)] text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFE4EC] to-[#F8C8DC] border border-[#B98575]/60 flex items-center justify-center mx-auto text-[#54263D] shadow-md animate-bounce">
            <Trophy className="w-8 h-8 text-[#B98575]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold flex items-center justify-center gap-1.5">
              <Star className="w-4 h-4 fill-current text-amber-500" />
              <span>Challenger Champion • All Games Cleared!</span>
              <Star className="w-4 h-4 fill-current text-amber-500" />
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#54263D]">
              Shandar Kamyabi! 👑
            </h2>
            <p className="text-sm text-[#54263D] font-serif max-w-md mx-auto leading-relaxed">
              BLACK ROSE MT ne teeno games ko haseen tareeqay se paar kar liya!
              Ab aasmaan par saji shahi duayein aapka intezar kar rahi hain.
            </p>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#B98575] via-[#EFA7C4] to-[#B98575] text-white font-bold text-sm tracking-wide hover:brightness-105 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mx-auto animate-pulse"
          >
            <span>A Sky Full of Duas 🌙 Kholein</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};
