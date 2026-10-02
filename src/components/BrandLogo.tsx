import React, { useState } from 'react';
import { BRAND_LOGO_IMAGE } from '../data/products';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'dark' | 'light';
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  variant = 'dark',
  className = '',
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  // Badge dimensions
  const badgeSize = {
    sm: 'w-8 h-8 sm:w-9 sm:h-9',
    md: 'w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12',
    lg: 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24',
  }[size];

  // Title styling
  const titleClass = {
    sm: 'text-xs sm:text-sm font-black tracking-tight',
    md: 'text-sm sm:text-base md:text-lg font-black tracking-tight leading-none',
    lg: 'text-lg sm:text-xl md:text-2xl font-black tracking-tight leading-none',
    xl: 'text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-none',
  }[size];

  const subClass = {
    sm: 'text-[7px] tracking-[0.14em]',
    md: 'text-[7.5px] sm:text-[9px] tracking-[0.16em] sm:tracking-[0.24em]',
    lg: 'text-[9px] sm:text-xs tracking-[0.2em] sm:tracking-[0.26em]',
    xl: 'text-[10px] sm:text-sm tracking-[0.22em] sm:tracking-[0.28em]',
  }[size];

  const tagClass = {
    sm: 'hidden sm:block text-[7px] tracking-[0.12em]',
    md: 'hidden sm:block text-[8px] tracking-[0.16em]',
    lg: 'hidden sm:block text-[9px] tracking-[0.18em]',
    xl: 'text-[9px] sm:text-[10px] tracking-[0.2em]',
  }[size];

  const isDark = variant === 'dark';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 sm:gap-3 select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* Exact Brand Logo Badge */}
      <div
        className={`${badgeSize} rounded-xl bg-black border border-amber-400/40 p-0.5 shadow-md flex items-center justify-center shrink-0 overflow-hidden group-hover:border-amber-400 group-hover:scale-105 transition-all duration-200`}
      >
        {!imageError ? (
          <img
            src={BRAND_LOGO_IMAGE}
            alt="Roshan Chasma Ghar Logo"
            className="w-full h-full object-contain rounded-lg"
            onError={() => setImageError(true)}
          />
        ) : (
          /* High-Fidelity SVG Fallback matching the exact logo */
          <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
            <rect width="200" height="200" fill="#000000" />
            <g>
              <circle cx="78" cy="62" r="16.5" stroke="#FDC700" strokeWidth="5" fill="none" />
              <circle cx="122" cy="62" r="16.5" stroke="#FDC700" strokeWidth="5" fill="none" />
              <path d="M 94.5 61 C 97 57.5, 103 57.5, 105.5 61" stroke="#FDC700" strokeWidth="5" strokeLinecap="round" fill="none" />
              <line x1="61.5" y1="62" x2="55" y2="62" stroke="#FDC700" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="138.5" y1="62" x2="145" y2="62" stroke="#FDC700" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 48 85 C 75 75, 125 75, 152 85 C 125 79, 75 79, 48 85 Z" fill="#FDC700" />
            </g>
            <text x="100" y="122" fontFamily="'Outfit', sans-serif" fontWeight="900" fontSize="28" fill="#FFFFFF" textAnchor="middle" letterSpacing="3.5">ROSHAN</text>
            <text x="100" y="141" fontFamily="'DM Sans', sans-serif" fontWeight="600" fontSize="8.5" fill="#E5D5B5" textAnchor="middle" letterSpacing="4.5">CHASMA GHAR</text>
          </svg>
        )}
      </div>

      {/* Brand Typography Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-display ${titleClass} ${
                isDark ? 'text-white' : 'text-slate-900'
              } group-hover:text-amber-400 transition-colors`}
            >
              ROSHAN
            </span>
            <span
              className={`font-display ${titleClass} text-amber-400 font-extrabold`}
            >
              CHASMA GHAR
            </span>
          </div>
          <span
            className={`uppercase font-semibold mt-0.5 ${subClass} ${
              isDark ? 'text-[#e5d5b5]' : 'text-amber-800'
            }`}
          >
            OPTICIANS &amp; VISION CARE
          </span>
          <span
            className={`uppercase font-medium ${tagClass} ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            ESTD. 1982 · MUMBAI
          </span>
        </div>
      )}
    </div>
  );
};
