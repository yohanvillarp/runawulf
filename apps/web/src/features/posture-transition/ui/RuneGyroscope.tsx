/**
 * @file RuneGyroscope.tsx
 * @description Concentric counter-rotating Elder Futhark rune rings with dynamic neon glow.
 */

import { useMemo } from 'react';
import { ELDER_FUTHARK_RUNES } from '@/shared/lib/runes';

interface RuneGyroscopeProps {
  accentColor: string;
  size?: number;
}

export function RuneGyroscope({ accentColor, size = 320 }: RuneGyroscopeProps) {
  const outerRunes = useMemo(() => {
    const runes = ELDER_FUTHARK_RUNES.slice(0, 16);
    const radius = 135;
    const center = 160;

    return runes.map((rune, i) => {
      const angle = (i / runes.length) * 2 * Math.PI;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return { rune, x, y, angle: (angle * 180) / Math.PI + 90 };
    });
  }, []);

  const innerRunes = useMemo(() => {
    const runes = ELDER_FUTHARK_RUNES.slice(12, 24);
    const radius = 95;
    const center = 160;

    return runes.map((rune, i) => {
      const angle = (i / runes.length) * 2 * Math.PI;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return { rune, x, y, angle: (angle * 180) / Math.PI + 90 };
    });
  }, []);

  return (
    <div
      className="relative flex items-center justify-center pointer-events-none"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 320 320"
        className="w-full h-full overflow-visible"
        style={{ filter: `drop-shadow(0 0 16px ${accentColor}40)` }}
      >
        <defs>
          <radialGradient id="gyro-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
            <stop offset="70%" stopColor={accentColor} stopOpacity="0.05" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Subtle center ambient glow */}
        <circle cx="160" cy="160" r="140" fill="url(#gyro-glow)" />

        {/* Outer Circular Track */}
        <circle
          cx="160"
          cy="160"
          r="135"
          fill="none"
          stroke={accentColor}
          strokeWidth="1"
          strokeDasharray="4 8"
          strokeOpacity="0.4"
        />

        {/* Outer Rotating Ring (Clockwise) */}
        <g className="animate-[spin_20s_linear_infinite] origin-center">
          {outerRunes.map(({ rune, x, y, angle }, index) => (
            <text
              key={`outer-${index}`}
              x={x}
              y={y}
              fill={accentColor}
              fontSize="12"
              fontFamily="serif"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${angle}, ${x}, ${y})`}
              className="opacity-75 transition-colors duration-300"
            >
              {rune}
            </text>
          ))}
        </g>

        {/* Inner Circular Track */}
        <circle
          cx="160"
          cy="160"
          r="95"
          fill="none"
          stroke={accentColor}
          strokeWidth="1.2"
          strokeDasharray="6 6"
          strokeOpacity="0.5"
        />

        {/* Inner Rotating Ring (Counter-Clockwise) */}
        <g className="animate-[spin_12s_linear_infinite_reverse] origin-center">
          {innerRunes.map(({ rune, x, y, angle }, index) => (
            <text
              key={`inner-${index}`}
              x={x}
              y={y}
              fill={accentColor}
              fontSize="13"
              fontFamily="serif"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${angle}, ${x}, ${y})`}
              className="opacity-90 font-bold transition-colors duration-300"
            >
              {rune}
            </text>
          ))}
        </g>

        {/* Center Target Crosshairs / Runestone boundary */}
        <circle
          cx="160"
          cy="160"
          r="62"
          fill="none"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeOpacity="0.7"
        />
      </svg>
    </div>
  );
}
