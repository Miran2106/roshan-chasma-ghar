import React from 'react';
import { FrameShape } from '../types/optical';

interface FrameGraphicProps {
  shape?: FrameShape;
  type?: string;
  colorHex?: string;
  className?: string;
  showLensGlint?: boolean;
}

export const FrameGraphic: React.FC<FrameGraphicProps> = ({
  shape = 'round',
  type,
  colorHex = '#222226',
  className = 'w-full h-full',
  showLensGlint = true,
}) => {
  // Determine style variations
  const isGold = colorHex === '#d4af37' || colorHex === '#e0c068' || colorHex === '#c5a059' || colorHex === '#d1b26f';
  const isTortoise = colorHex === '#8d5b28' || colorHex === '#422817' || colorHex === '#63391d' || colorHex === '#6d4c41' || colorHex === '#b27a38';
  const isCrystal = colorHex === '#e8ecf1' || colorHex === '#f4ede4' || colorHex === '#f0f4f8';
  const isRimless = type === 'feather-rimless' || type === 'zephyr-air' || type === 'feather-titanium';

  // SVG Unique IDs
  const id = React.useId();
  const gradId = `grad-${id}`;
  const glintId = `glint-${id}`;
  const tortoiseId = `tort-${id}`;

  return (
    <div className={`relative flex items-center justify-center p-4 select-none ${className}`}>
      <svg
        viewBox="0 0 320 140"
        className="w-full h-auto max-h-[140px] drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic / Acetate Gradients */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            {isGold ? (
              <>
                <stop offset="0%" stopColor="#f3e5ab" />
                <stop offset="50%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#aa820a" />
              </>
            ) : isCrystal ? (
              <>
                <stop offset="0%" stopColor="#f0f4f8" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#d9e2ec" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#bcccdc" stopOpacity="0.85" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor={colorHex} />
                <stop offset="100%" stopColor={colorHex} />
              </>
            )}
          </linearGradient>

          {/* Tortoise pattern */}
          {isTortoise && (
            <pattern id={tortoiseId} width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#4a2c11" />
              <circle cx="4" cy="5" r="3.5" fill="#a4682b" />
              <circle cx="15" cy="14" r="4.5" fill="#d48c3b" />
              <circle cx="16" cy="4" r="2.5" fill="#281507" />
              <circle cx="7" cy="16" r="3" fill="#6a3b15" />
            </pattern>
          )}

          {/* Lens Optical Reflection Glint */}
          <linearGradient id={glintId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.28" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#c084fc" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Temple arms in background (folded or open perspective) */}
        <path
          d="M 45 68 Q 20 60 5 45 Q 2 43 0 45"
          stroke={isGold ? '#b89428' : '#3f3f46'}
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />
        <path
          d="M 275 68 Q 300 60 315 45 Q 318 43 320 45"
          stroke={isGold ? '#b89428' : '#3f3f46'}
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />

        {/* ================= SHAPE RENDERING ================= */}
        {shape === 'cat-eye' || type === 'solstice-cateye' || type === 'aura-cateye' ? (
          // CAT-EYE SILHOUETTE
          <g>
            {/* Left Lens */}
            <path
              d="M 60 48 Q 105 45 130 65 Q 135 98 105 108 Q 62 108 55 75 Z"
              fill={showLensGlint ? `url(#${glintId})` : '#f8fafc'}
              stroke="#e2e8f0"
              strokeWidth="0.8"
            />
            {/* Right Lens */}
            <path
              d="M 260 48 Q 215 45 190 65 Q 185 98 215 108 Q 258 108 265 75 Z"
              fill={showLensGlint ? `url(#${glintId})` : '#f8fafc'}
              stroke="#e2e8f0"
              strokeWidth="0.8"
            />
            {/* Rims */}
            <path
              d="M 42 42 Q 105 38 135 63 Q 140 106 102 115 Q 52 115 44 72 Q 40 50 42 42 Z"
              stroke={isTortoise ? `url(#${tortoiseId})` : `url(#${gradId})`}
              strokeWidth="7"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M 278 42 Q 215 38 185 63 Q 180 106 218 115 Q 268 115 276 72 Q 280 50 278 42 Z"
              stroke={isTortoise ? `url(#${tortoiseId})` : `url(#${gradId})`}
              strokeWidth="7"
              fill="none"
              strokeLinejoin="round"
            />
            {/* Bridge */}
            <path
              d="M 134 65 Q 160 56 186 65"
              stroke={isTortoise ? `url(#${tortoiseId})` : `url(#${gradId})`}
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : shape === 'geometric' || type === 'geometry-hex' || type === 'lucent-hex' ? (
          // HEXAGONAL / GEOMETRIC SILHOUETTE
          <g>
            {/* Left Hex Lens */}
            <polygon
              points="65,48 115,48 135,74 125,104 75,104 55,74"
              fill={showLensGlint ? `url(#${glintId})` : '#f8fafc'}
              stroke="#cbd5e1"
              strokeWidth="0.8"
            />
            {/* Right Hex Lens */}
            <polygon
              points="205,48 255,48 265,74 245,104 195,104 185,74"
              fill={showLensGlint ? `url(#${glintId})` : '#f8fafc'}
              stroke="#cbd5e1"
              strokeWidth="0.8"
            />
            {/* Rims */}
            <polygon
              points="65,48 115,48 135,74 125,104 75,104 55,74"
              stroke={isTortoise ? `url(#${tortoiseId})` : `url(#${gradId})`}
              strokeWidth="4"
              fill="none"
              strokeLinejoin="round"
            />
            <polygon
              points="205,48 255,48 265,74 245,104 195,104 185,74"
              stroke={isTortoise ? `url(#${tortoiseId})` : `url(#${gradId})`}
              strokeWidth="4"
              fill="none"
              strokeLinejoin="round"
            />
            {/* Arched Bridge */}
            <path
              d="M 134 68 Q 160 59 186 68"
              stroke={isTortoise ? `url(#${tortoiseId})` : `url(#${gradId})`}
              strokeWidth="3.5"
              fill="none"
            />
          </g>
        ) : shape === 'aviator' || type === 'crystal-aviator' || type === 'metropolis-aviator' ? (
          // AVIATOR SILHOUETTE
          <g>
            {/* Left Teardrop Lens */}
            <path
              d="M 60 52 Q 105 50 134 56 Q 138 95 110 112 Q 68 116 52 82 Z"
              fill={showLensGlint ? `url(#${glintId})` : '#f8fafc'}
              stroke="#cbd5e1"
              strokeWidth="0.8"
            />
            {/* Right Teardrop Lens */}
            <path
              d="M 260 52 Q 215 50 186 56 Q 182 95 210 112 Q 252 116 268 82 Z"
              fill={showLensGlint ? `url(#${glintId})` : '#f8fafc'}
              stroke="#cbd5e1"
              strokeWidth="0.8"
            />
            {/* Top Brow Bar */}
            <path
              d="M 72 44 L 248 44"
              stroke={isTortoise ? `url(#${tortoiseId})` : `url(#${gradId})`}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Lower Bridge */}
            <path
              d="M 130 62 Q 160 57 190 62"
              stroke={isTortoise ? `url(#${tortoiseId})` : `url(#${gradId})`}
              strokeWidth="3"
            />
            {/* Left & Right Rims */}
            <path
              d="M 60 52 Q 105 50 134 56 Q 138 95 110 112 Q 68 116 52 82 Z"
              stroke={isTortoise ? `url(#${tortoiseId})` : `url(#${gradId})`}
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M 260 52 Q 215 50 186 56 Q 182 95 210 112 Q 252 116 268 82 Z"
              stroke={isTortoise ? `url(#${tortoiseId})` : `url(#${gradId})`}
              strokeWidth="4"
              fill="none"
            />
          </g>
        ) : shape === 'square' || type === 'havana-square' || type === 'classic-82' || type === 'heritage-browline' ? (
          // BOLD SQUARE / WAYFARER SILHOUETTE
          <g>
            {/* Left Lens */}
            <rect
              x="58"
              y="52"
              width="74"
              height="54"
              rx="12"
              fill={showLensGlint ? `url(#${glintId})` : '#f8fafc'}
              stroke="#e2e8f0"
              strokeWidth="0.8"
            />
            {/* Right Lens */}
            <rect
              x="188"
              y="52"
              width="74"
              height="54"
              rx="12"
              fill={showLensGlint ? `url(#${glintId})` : '#f8fafc'}
              stroke="#e2e8f0"
              strokeWidth="0.8"
            />
            {/* Rims */}
            <rect
              x="55"
              y="48"
              width="80"
              height="60"
              rx="14"
              stroke={isTortoise ? `url(#${tortoiseId})` : `url(#${gradId})`}
              strokeWidth="7"
              fill="none"
            />
            <rect
              x="185"
              y="48"
              width="80"
              height="60"
              rx="14"
              stroke={isTortoise ? `url(#${tortoiseId})` : `url(#${gradId})`}
              strokeWidth="7"
              fill="none"
            />
            {/* Bridge */}
            <path
              d="M 134 60 Q 160 54 186 60"
              stroke={isTortoise ? `url(#${tortoiseId})` : `url(#${gradId})`}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            {/* Rivets on temples */}
            <ellipse cx="48" cy="54" rx="2.5" ry="1.5" fill="#e2e8f0" />
            <ellipse cx="272" cy="54" rx="2.5" ry="1.5" fill="#e2e8f0" />
          </g>
        ) : isRimless ? (
          // RIMLESS ULTRA-LIGHT TITANIUM SILHOUETTE
          <g>
            {/* Left Rimless Lens */}
            <ellipse
              cx="95"
              cy="75"
              rx="39"
              ry="29"
              fill={showLensGlint ? `url(#${glintId})` : '#f8fafc'}
              stroke="#94a3b8"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            {/* Right Rimless Lens */}
            <ellipse
              cx="225"
              cy="75"
              rx="39"
              ry="29"
              fill={showLensGlint ? `url(#${glintId})` : '#f8fafc'}
              stroke="#94a3b8"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            {/* Titanium Arch Bridge with Mount Pins */}
            <path
              d="M 133 72 Q 160 59 187 72"
              stroke={isGold ? '#d4af37' : '#94a3b8'}
              strokeWidth="2.5"
              fill="none"
            />
            {/* Tiny Mount Hardware Screws */}
            <circle cx="134" cy="72" r="2" fill="#475569" />
            <circle cx="186" cy="72" r="2" fill="#475569" />
            <circle cx="56" cy="72" r="2" fill="#475569" />
            <circle cx="264" cy="72" r="2" fill="#475569" />
            {/* Temple Ends */}
            <line x1="56" y1="72" x2="38" y2="70" stroke={isGold ? '#d4af37' : '#94a3b8'} strokeWidth="2.5" />
            <line x1="264" y1="72" x2="282" y2="70" stroke={isGold ? '#d4af37' : '#94a3b8'} strokeWidth="2.5" />
          </g>
        ) : (
          // ROUND / PANTOS SILHOUETTE (Aurelia, Aero Black, Chaurasia Round)
          <g>
            {/* Left Lens */}
            <ellipse
              cx="95"
              cy="76"
              rx="37"
              ry="33"
              fill={showLensGlint ? `url(#${glintId})` : '#f8fafc'}
              stroke="#e2e8f0"
              strokeWidth="0.8"
            />
            {/* Right Lens */}
            <ellipse
              cx="225"
              cy="76"
              rx="37"
              ry="33"
              fill={showLensGlint ? `url(#${glintId})` : '#f8fafc'}
              stroke="#e2e8f0"
              strokeWidth="0.8"
            />
            {/* Rims */}
            <ellipse
              cx="95"
              cy="76"
              rx="39"
              ry="35"
              stroke={isTortoise ? `url(#${tortoiseId})` : `url(#${gradId})`}
              strokeWidth={isGold ? '3.5' : '6'}
              fill="none"
            />
            <ellipse
              cx="225"
              cy="76"
              rx="39"
              ry="35"
              stroke={isTortoise ? `url(#${tortoiseId})` : `url(#${gradId})`}
              strokeWidth={isGold ? '3.5' : '6'}
              fill="none"
            />
            {/* Keyhole / Arched Bridge */}
            <path
              d="M 133 72 Q 160 60 187 72"
              stroke={isTortoise ? `url(#${tortoiseId})` : `url(#${gradId})`}
              strokeWidth={isGold ? '3.5' : '5'}
              strokeLinecap="round"
              fill="none"
            />
            {/* Rivets if acetate */}
            {!isGold && (
              <>
                <circle cx="51" cy="62" r="1.5" fill="#f8fafc" opacity="0.9" />
                <circle cx="269" cy="62" r="1.5" fill="#f8fafc" opacity="0.9" />
              </>
            )}
          </g>
        )}

        {/* Nose Pads with soft silicone glow */}
        <ellipse cx="140" cy="82" rx="2.5" ry="5.5" fill="#cbd5e1" opacity="0.75" />
        <ellipse cx="180" cy="82" rx="2.5" ry="5.5" fill="#cbd5e1" opacity="0.75" />

        {/* Subtle Lens Glint Streak */}
        {showLensGlint && (
          <>
            <path
              d="M 80 54 L 114 96"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.35"
            />
            <path
              d="M 210 54 L 244 96"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.35"
            />
          </>
        )}
      </svg>
    </div>
  );
};
