/**
 * @file WolfFacets.tsx
 * @description Polygonal geometric facets and SVG definitions for the Runic Wolf Vector.
 */

interface WolfFacetsProps {
  accentColor: string;
  rune: string;
}

export function WolfFacets({ accentColor, rune }: WolfFacetsProps) {
  return (
    <>
      <defs>
        <linearGradient id="wolf-metallic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        <linearGradient id="wolf-accent-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.1" />
        </linearGradient>

        <filter id="eye-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer Crown / Ears Polyhedra */}
      {/* Left Ear */}
      <polygon
        points="70,75 55,25 90,55"
        fill="url(#wolf-metallic)"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeOpacity="0.7"
      />
      <polygon
        points="55,25 35,55 70,75"
        fill="#090d16"
        stroke={accentColor}
        strokeWidth="0.8"
        strokeOpacity="0.4"
      />

      {/* Right Ear */}
      <polygon
        points="130,75 145,25 110,55"
        fill="url(#wolf-metallic)"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeOpacity="0.7"
      />
      <polygon
        points="145,25 165,55 130,75"
        fill="#090d16"
        stroke={accentColor}
        strokeWidth="0.8"
        strokeOpacity="0.4"
      />

      {/* Forehead Facets */}
      <polygon
        points="90,55 100,45 110,55 100,75"
        fill="url(#wolf-accent-grad)"
        stroke={accentColor}
        strokeWidth="1.5"
      />
      <polygon
        points="70,75 90,55 100,75"
        fill="#0d1527"
        stroke={accentColor}
        strokeWidth="1"
        strokeOpacity="0.6"
      />
      <polygon
        points="130,75 110,55 100,75"
        fill="#0d1527"
        stroke={accentColor}
        strokeWidth="1"
        strokeOpacity="0.6"
      />

      {/* Center Rune Brand (Forehead stone) */}
      <circle
        cx="100"
        cy="75"
        r="14"
        fill="#050811"
        stroke={accentColor}
        strokeWidth="2"
        style={{ filter: `drop-shadow(0 0 10px ${accentColor})` }}
      />
      <text
        x="100"
        y="79"
        fill={accentColor}
        fontSize="16"
        fontFamily="serif"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ filter: 'url(#eye-glow)' }}
      >
        {rune}
      </text>

      {/* Temporal / Brow Facets */}
      <polygon
        points="70,75 100,75 80,105"
        fill="#111c30"
        stroke={accentColor}
        strokeWidth="0.8"
        strokeOpacity="0.5"
      />
      <polygon
        points="130,75 100,75 120,105"
        fill="#111c30"
        stroke={accentColor}
        strokeWidth="0.8"
        strokeOpacity="0.5"
      />

      {/* Cheeks */}
      <polygon
        points="35,55 70,75 50,115"
        fill="#0a0f1d"
        stroke={accentColor}
        strokeWidth="0.8"
        strokeOpacity="0.4"
      />
      <polygon
        points="165,55 130,75 150,115"
        fill="#0a0f1d"
        stroke={accentColor}
        strokeWidth="0.8"
        strokeOpacity="0.4"
      />

      {/* Piercing Glowing Eyes */}
      <polygon
        points="72,98 86,95 82,104"
        fill={accentColor}
        style={{ filter: 'url(#eye-glow)' }}
      />
      <circle cx="79" cy="99" r="1.5" fill="#ffffff" />

      <polygon
        points="128,98 114,95 118,104"
        fill={accentColor}
        style={{ filter: 'url(#eye-glow)' }}
      />
      <circle cx="121" cy="99" r="1.5" fill="#ffffff" />

      {/* Bridge of the Snout */}
      <polygon
        points="100,75 80,105 100,140"
        fill="url(#wolf-metallic)"
        stroke={accentColor}
        strokeWidth="1"
        strokeOpacity="0.7"
      />
      <polygon
        points="100,75 120,105 100,140"
        fill="#131e33"
        stroke={accentColor}
        strokeWidth="1"
        strokeOpacity="0.7"
      />

      {/* Snout Flanks & Muzzle */}
      <polygon
        points="80,105 50,115 75,145 100,140"
        fill="#0b101e"
        stroke={accentColor}
        strokeWidth="0.8"
        strokeOpacity="0.5"
      />
      <polygon
        points="120,105 150,115 125,145 100,140"
        fill="#0b101e"
        stroke={accentColor}
        strokeWidth="0.8"
        strokeOpacity="0.5"
      />

      {/* Nose Tip */}
      <polygon
        points="92,140 108,140 100,150"
        fill={accentColor}
        stroke="#000"
        strokeWidth="0.5"
        style={{ filter: `drop-shadow(0 0 6px ${accentColor})` }}
      />

      {/* Lower Jaw & Cyber-Fangs */}
      <polygon
        points="85,147 100,150 92,165"
        fill="#1e293b"
        stroke={accentColor}
        strokeWidth="0.8"
        strokeOpacity="0.6"
      />
      <polygon
        points="115,147 100,150 108,165"
        fill="#1e293b"
        stroke={accentColor}
        strokeWidth="0.8"
        strokeOpacity="0.6"
      />
      <polygon points="86,149 90,149 88,157" fill="#ffffff" />
      <polygon points="110,149 114,149 112,157" fill="#ffffff" />

      {/* Chin Apex */}
      <polygon
        points="92,165 108,165 100,178"
        fill="url(#wolf-metallic)"
        stroke={accentColor}
        strokeWidth="1.2"
      />
    </>
  );
}
