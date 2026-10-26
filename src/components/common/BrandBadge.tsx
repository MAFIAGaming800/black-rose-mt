import React from 'react';
import { Sparkles } from 'lucide-react';

interface BrandBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandBadge: React.FC<BrandBadgeProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-24 h-24 text-[10px]',
    md: 'w-28 h-28 text-xs',
    lg: 'w-36 h-36 text-sm',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}
      role="region"
      aria-label="Badge: From Shona Bhai"
    >
      {/* Outer Rotating Glowing Ring */}
      <div className="absolute inset-0 rounded-full border border-[#B98575]/40 animate-slow-spin shadow-[0_0_15px_rgba(239,167,196,0.35)]" />
      <div className="absolute inset-1 rounded-full border border-dashed border-[#EFA7C4]/50 animate-[slow-spin_36s_linear_infinite_reverse]" />

      {/* Badge Core */}
      <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FFFAFC] to-[#FFE4EC] p-2 flex flex-col items-center justify-center text-center border border-[#B98575]/50 shadow-sm group">
        <Sparkles className="w-3.5 h-3.5 text-[#B98575] mb-0.5 animate-pulse" />
        <span className="text-[9px] tracking-widest uppercase text-[#834F6A] font-semibold">Presented By</span>
        <span className="font-serif font-bold text-[#54263D] tracking-wide text-xs drop-shadow-xs">
          Shona Bhai
        </span>
        <span className="text-[9px] text-[#B98575] italic mt-0.5 font-medium">Bhai & Friend</span>
      </div>
    </div>
  );
};
