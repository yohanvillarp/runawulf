/**
 * @file RunicWolfVector.tsx
 * @description High-fidelity polyhedral cyber-nordic wolf head with glowing eyes and dynamic posture rune.
 */

import { WolfFacets } from './WolfFacets';

interface RunicWolfVectorProps {
  accentColor: string;
  rune: string;
  runeName?: string;
  isShockwaveActive?: boolean;
  isGlowSurge?: boolean;
  showLabel?: boolean;
  sizeClassName?: string;
}

export function RunicWolfVector({
  accentColor,
  rune,
  runeName,
  isShockwaveActive = false,
  isGlowSurge = false,
  showLabel = false,
  sizeClassName = 'w-44 h-44 sm:w-52 sm:h-52',
}: RunicWolfVectorProps) {
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Dynamic Energy Shockwave when commit or step transition occurs */}
      {isShockwaveActive && (
        <div
          className="absolute inset-0 rounded-full animate-ping pointer-events-none"
          style={{
            backgroundColor: `${accentColor}30`,
            border: `2px solid ${accentColor}`,
          }}
        />
      )}

      <svg
        viewBox="0 0 200 200"
        className={`${sizeClassName} drop-shadow-2xl transition-all duration-500 transform ${
          isGlowSurge ? 'scale-105' : 'scale-100'
        } ${isGlowSurge ? 'animate-none' : 'animate-[pulse_3s_ease-in-out_infinite]'}`}
        style={{
          filter: isGlowSurge
            ? `drop-shadow(0 0 30px ${accentColor}) drop-shadow(0 0 50px ${accentColor}90)`
            : `drop-shadow(0 0 16px ${accentColor}80) drop-shadow(0 0 32px ${accentColor}40)`,
        }}
      >
        <WolfFacets accentColor={accentColor} rune={rune} />
      </svg>

      {/* Optional Runic Sub-Title beneath wolf */}
      {showLabel && runeName && (
        <div className="mt-2 text-center pointer-events-none">
          <span
            className="text-[10px] font-mono tracking-widest uppercase font-bold px-2.5 py-0.5 rounded-none border bg-slate-950"
            style={{
              color: accentColor,
              borderColor: `${accentColor}50`,
              boxShadow: `0 0 10px ${accentColor}30`,
            }}
          >
            {runeName}
          </span>
        </div>
      )}
    </div>
  );
}
