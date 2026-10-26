import React, { useState } from 'react';
import { Crown } from 'lucide-react';

interface LogoContainerProps {
  customLogoUrl?: string | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LogoContainer: React.FC<LogoContainerProps> = ({
  customLogoUrl,
  className = '',
  size = 'md',
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'h-10 text-sm',
    md: 'h-16 text-lg',
    lg: 'h-24 text-2xl',
  };

  const targetLogoSrc = customLogoUrl || '/assets/logo.png';
  const hasImage = targetLogoSrc && !imageError;

  return (
    <div className={`inline-flex items-center justify-center rounded-full overflow-hidden ${className}`}>
      {hasImage ? (
        <img
          src={targetLogoSrc}
          alt="Official BLACK ROSE MT Logo"
          onError={() => setImageError(true)}
          className={`object-contain max-w-full drop-shadow-[0_4px_16px_rgba(185,133,117,0.35)] ${sizeClasses[size]}`}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#FFFAFC] border border-[#B98575]/40 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-[#FFE4EC] border border-[#B98575]/40 flex items-center justify-center text-[#B98575]">
            <Crown className="w-4 h-4 text-[#B98575]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-cinzel font-bold tracking-widest text-[#54263D] uppercase text-sm sm:text-base">
              BLACK ROSE MT
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[#834F6A] font-semibold">
              Official Birthday Edition
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
