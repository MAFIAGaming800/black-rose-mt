import React from 'react';

interface SmokeParticlesProps {
  className?: string;
}

export const SmokeParticles: React.FC<SmokeParticlesProps> = ({ className = '' }) => {
  return (
    <div
      className={`absolute bottom-full left-1/2 -translate-x-1/2 w-8 h-12 pointer-events-none overflow-visible flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      {/* Primary Curl 1: Pearl White core smoke wisp */}
      <div
        className="absolute bottom-0 w-3.5 h-3.5 rounded-full bg-gradient-to-t from-[#F7F3F0]/90 via-[#F5E8D5]/60 to-transparent blur-[1px] animate-smoke-1 shadow-[0_0_8px_rgba(247,243,240,0.6)]"
      />

      {/* Secondary Curl 2: Champagne drift wisp */}
      <div
        className="absolute bottom-1 w-4 h-4 rounded-full bg-gradient-to-tr from-[#F5E8D5]/80 via-[#F7F3F0]/40 to-transparent blur-[1.5px] animate-smoke-2"
      />

      {/* Tertiary Curl 3: Soft wide vapor dispersion */}
      <div
        className="absolute bottom-2 w-5 h-5 rounded-full bg-gradient-to-b from-[#F7F3F0]/50 to-[#F5E8D5]/10 blur-[2px] animate-smoke-3"
      />

      {/* Micro-ember: Champagne spark extinguishing in the air */}
      <div
        className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#F5E8D5] shadow-[0_0_6px_#F5E8D5] animate-smoke-ember"
      />
    </div>
  );
};
