import React, { useState } from 'react';
import { Sparkles, CheckCircle2, RotateCcw, ArrowRight, HelpCircle } from 'lucide-react';
import { GAMES_DATA } from '../../config/content';

interface MindTrapGameProps {
  onGameComplete: () => void;
}

export const MindTrapGame: React.FC<MindTrapGameProps> = ({ onGameComplete }) => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isWon, setIsWon] = useState(false);

  const puzzles = GAMES_DATA.mindTrap.puzzles;
  const currentPuzzle = puzzles[currentPuzzleIndex];

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswerIndex(index);
    if (index === currentPuzzle.correctIndex) {
      if (currentPuzzleIndex < puzzles.length - 1) {
        setFeedback(currentPuzzle.explanation);
        setTimeout(() => {
          setCurrentPuzzleIndex((prev) => prev + 1);
          setSelectedAnswerIndex(null);
          setFeedback(null);
        }, 1300);
      } else {
        setFeedback(currentPuzzle.explanation);
        setIsWon(true);
      }
    } else {
      setFeedback('Hahaha! Dhoka kha gaye na? Yeh dimagh ka trap tha! Dobara socho! 😂');
    }
  };

  const handleRetry = () => {
    setSelectedAnswerIndex(null);
    setFeedback(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 text-center select-none">
      {/* Intro */}
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#B98575] font-semibold flex items-center justify-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#EFA7C4]" />
          <span>Game 3 • Dimagh Ka Dhoka (Sawal {currentPuzzleIndex + 1}/{puzzles.length})</span>
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#54263D]">
          Don’t Trust Your Eyes 😈
        </h3>
        <p className="text-xs sm:text-sm text-[#834F6A] max-w-lg mx-auto font-serif leading-relaxed">
          {GAMES_DATA.mindTrap.intro}
        </p>
      </div>

      {/* Main Puzzle Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-[#B98575]/40 shadow-md space-y-5 text-left">
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#B98575] font-bold">
            Mind Trap Riddle #{currentPuzzleIndex + 1}
          </span>
          <h4 className="font-serif text-lg sm:text-xl font-bold text-[#54263D] leading-snug">
            "{currentPuzzle.question}"
          </h4>
        </div>

        {/* Answer Options */}
        <div className="space-y-2.5 pt-2">
          {currentPuzzle.options.map((option, idx) => {
            const isSelected = selectedAnswerIndex === idx;
            const isCorrect = idx === currentPuzzle.correctIndex;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectAnswer(idx)}
                className={`w-full p-4 rounded-2xl border text-xs sm:text-sm font-serif font-bold transition-all text-left flex items-center justify-between shadow-2xs cursor-pointer ${
                  isSelected && isCorrect
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400'
                    : isSelected && !isCorrect
                    ? 'bg-rose-100 border-rose-400 text-rose-950'
                    : 'bg-[#FFE4EC]/60 hover:bg-[#FFE4EC] border-[#B98575]/30 text-[#54263D]'
                }`}
              >
                <span>{option}</span>
                {isSelected && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-serif leading-relaxed animate-in fade-in duration-200 ${
            feedback.includes('Bilkul') || feedback.includes('Kamaal')
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 shadow-xs'
              : 'bg-rose-50/80 border-rose-200 text-rose-800'
          }`}
        >
          {feedback}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        {selectedAnswerIndex !== null && !isWon && selectedAnswerIndex !== currentPuzzle.correctIndex && (
          <button
            type="button"
            onClick={handleRetry}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#54263D] bg-[#FFE4EC] hover:bg-[#F8C8DC] border border-[#B98575]/30 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Dobara Sochein</span>
          </button>
        )}

        {isWon && (
          <button
            type="button"
            onClick={onGameComplete}
            className="flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#B98575] via-[#EFA7C4] to-[#B98575] hover:brightness-105 rounded-full shadow-md transition-all cursor-pointer animate-pulse"
          >
            <span>Shandar Jeet! A Sky Full of Duas 🌙 Par Chalein</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
