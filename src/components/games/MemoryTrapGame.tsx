import React, { useState, useEffect } from 'react';
import { Eye, Sparkles, CheckCircle2, RotateCcw, ArrowRight, Timer } from 'lucide-react';
import { GAMES_DATA } from '../../config/content';

interface MemoryTrapGameProps {
  onGameComplete: () => void;
}

export const MemoryTrapGame: React.FC<MemoryTrapGameProps> = ({ onGameComplete }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [showPattern, setShowPattern] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isWon, setIsWon] = useState(false);

  const rounds = GAMES_DATA.memoryTrap.rounds;
  const current = rounds[currentRound];

  // Countdown timer while showing the pattern
  useEffect(() => {
    if (!showPattern) return;

    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowPattern(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showPattern, currentRound]);

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
    if (option === current.missing) {
      if (currentRound < rounds.length - 1) {
        setFeedback('Wah! Zabardast memory! Aglay round ki taraf barhein!');
        setTimeout(() => {
          setCurrentRound((prev) => prev + 1);
          setShowPattern(true);
          setSelectedOption(null);
          setFeedback(null);
        }, 1200);
      } else {
        setFeedback('Aala zehan! Aapne Memory Trap ko mukammal fateh kar liya! 🏆');
        setIsWon(true);
      }
    } else {
      setFeedback('Oho! Yeh symbol nahi tha. Dobara yaad karein! 🧐');
    }
  };

  const handleRetryRound = () => {
    setSelectedOption(null);
    setFeedback(null);
    setShowPattern(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 text-center select-none">
      {/* Intro */}
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#B98575] font-semibold flex items-center justify-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-[#EFA7C4]" />
          <span>Game 2 • Yaad Hai Ya Nahi? (Round {currentRound + 1}/{rounds.length})</span>
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#54263D]">
          Memory Trap
        </h3>
        <p className="text-xs sm:text-sm text-[#834F6A] max-w-lg mx-auto font-serif leading-relaxed">
          {GAMES_DATA.memoryTrap.intro}
        </p>
      </div>

      {/* Pattern Display vs Hidden Phase */}
      <div className="p-6 rounded-3xl glass-card border border-[#B98575]/40 shadow-md min-h-[200px] flex flex-col items-center justify-center space-y-4">
        {showPattern ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#B98575]">
              <Timer className="w-4 h-4 animate-spin text-[#EFA7C4]" />
              <span>Ghaur se dekhein! ({countdown}s)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {current.symbols.map((sym, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3 rounded-2xl bg-[#FFE4EC] border border-[#B98575]/30 font-serif font-bold text-sm sm:text-base text-[#54263D] shadow-xs"
                >
                  {sym}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300 w-full">
            <div className="space-y-1">
              <span className="text-xs font-serif text-[#B98575] font-semibold">
                Pattern chup gaya hai!
              </span>
              <h4 className="font-serif text-base sm:text-lg font-bold text-[#54263D]">
                Kaunsa symbol missing hai?
              </h4>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {current.options.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === current.missing;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    className={`px-4 py-3 rounded-2xl border text-xs sm:text-sm font-serif font-bold transition-all shadow-xs cursor-pointer ${
                      isSelected && isCorrect
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400'
                        : isSelected && !isCorrect
                        ? 'bg-rose-100 border-rose-400 text-rose-900'
                        : 'bg-[#FFE4EC]/70 hover:bg-[#FFE4EC] border-[#B98575]/30 text-[#54263D]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-serif leading-relaxed animate-in fade-in duration-200 ${
            feedback.includes('Wah') || feedback.includes('Aala')
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
              : 'bg-rose-50/80 border-rose-200 text-rose-800'
          }`}
        >
          {feedback}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        {!showPattern && !isWon && (
          <button
            type="button"
            onClick={handleRetryRound}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#54263D] bg-[#FFE4EC] hover:bg-[#F8C8DC] border border-[#B98575]/30 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Dobara Dekhein</span>
          </button>
        )}

        {isWon && (
          <button
            type="button"
            onClick={onGameComplete}
            className="flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#B98575] via-[#EFA7C4] to-[#B98575] hover:brightness-105 rounded-full shadow-md transition-all cursor-pointer animate-pulse"
          >
            <span>Wah! Teesray Game Par Chalein</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
