import React, { useState } from 'react';
import { DoorClosed, Sparkles, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { GAMES_DATA } from '../../config/content';

interface TrickDoorGameProps {
  onGameComplete: () => void;
}

export const TrickDoorGame: React.FC<TrickDoorGameProps> = ({ onGameComplete }) => {
  const [selectedDoorId, setSelectedDoorId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isWon, setIsWon] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const data = GAMES_DATA.trickDoor;

  const handleSelectDoor = (doorId: number) => {
    setSelectedDoorId(doorId);
    const door = data.doors.find((d) => d.id === doorId);
    if (!door) return;

    setFeedback(door.reaction);
    if (door.isCorrect) {
      setIsWon(true);
    } else {
      setIsWon(false);
    }
  };

  const handleReset = () => {
    setSelectedDoorId(null);
    setFeedback(null);
    setIsWon(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 text-center select-none">
      {/* Intro & Clue Prompt */}
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#B98575] font-semibold flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#EFA7C4]" />
          <span>Game 1 • {data.subtitle}</span>
          <Sparkles className="w-3.5 h-3.5 text-[#EFA7C4]" />
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#54263D]">
          {data.title}
        </h3>
        <p className="text-xs sm:text-sm text-[#834F6A] max-w-lg mx-auto font-serif leading-relaxed">
          {data.intro}
        </p>
      </div>

      {/* 3 Doors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {data.doors.map((door) => {
          const isSelected = selectedDoorId === door.id;
          const isSelectedAndCorrect = isSelected && door.isCorrect;
          const isSelectedAndWrong = isSelected && !door.isCorrect;

          return (
            <div
              key={door.id}
              onClick={() => !isWon && handleSelectDoor(door.id)}
              className={`p-5 rounded-2xl glass-card border transition-all duration-300 flex flex-col items-center justify-between min-h-[220px] ${
                isWon && !isSelected ? 'opacity-40 pointer-events-none' : ''
              } ${
                isSelectedAndCorrect
                  ? 'border-emerald-500 bg-emerald-50/70 shadow-lg scale-102 ring-2 ring-emerald-400'
                  : isSelectedAndWrong
                  ? 'border-rose-400 bg-rose-50/70 shadow-md ring-1 ring-rose-300'
                  : 'border-[#B98575]/30 hover:border-[#B98575] hover:shadow-md cursor-pointer hover:-translate-y-1'
              }`}
              role="button"
              tabIndex={0}
              aria-label={`Select ${door.title}`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFE4EC] to-[#F8C8DC] border border-[#B98575]/40 flex items-center justify-center text-[#54263D] mb-3 shadow-xs">
                <DoorClosed className={`w-6 h-6 ${isSelectedAndCorrect ? 'text-emerald-600' : 'text-[#54263D]'}`} />
              </div>

              <div className="space-y-1">
                <h4 className="font-serif text-base font-bold text-[#54263D]">
                  {door.title}
                </h4>
                <p className="text-[11px] text-[#834F6A] font-serif leading-snug italic px-1">
                  "{door.clue}"
                </p>
              </div>

              <div className="pt-3">
                {isSelectedAndCorrect ? (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Kamyabi!
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-[#B98575] group-hover:text-[#54263D]">
                    {isSelected ? 'Chuna Gaya' : 'Yeh Darwaza Kholein'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reaction and Feedback Message */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-serif leading-relaxed animate-in fade-in duration-200 ${
            isWon
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 shadow-sm'
              : 'bg-rose-50/80 border-rose-200 text-rose-800'
          }`}
        >
          {feedback}
        </div>
      )}

      {/* Controls & Victory Action */}
      <div className="flex items-center justify-center gap-3 pt-2">
        {!isWon ? (
          <>
            <button
              type="button"
              onClick={() => setShowHint((prev) => !prev)}
              className="px-4 py-2 text-xs font-medium text-[#834F6A] hover:text-[#54263D] hover:bg-[#FFE4EC] rounded-xl transition-colors cursor-pointer"
            >
              {showHint ? 'Hint Chupayein' : '💡 Madad / Hint'}
            </button>

            {selectedDoorId && !isWon && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#54263D] bg-[#FFE4EC] hover:bg-[#F8C8DC] border border-[#B98575]/30 rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Dobara Koshish Karein</span>
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={onGameComplete}
            className="flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#B98575] via-[#EFA7C4] to-[#B98575] hover:brightness-105 rounded-full shadow-md transition-all cursor-pointer animate-pulse"
          >
            <span>Shabash! Aglay Game Par Chalein</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {showHint && !isWon && (
        <div className="p-3 bg-[#FFE4EC]/60 border border-[#B98575]/30 rounded-xl text-xs text-[#54263D] font-serif italic max-w-md mx-auto">
          💡 <strong>Hint:</strong> Asli darwaza woh hai jahan champagne aur mukhlis dua ka zikr ho!
        </div>
      )}
    </div>
  );
};
