/**
 * @file Header.tsx
 * @description Enterprise control plane header with Link to root on brand,
 * centered Cyber-Dock posture switcher, and minimalist language controls.
 */

import { Link } from 'react-router';
import { ModeSegmentedControl } from '@/features/mode-switcher';
import { LanguageSwitcher } from '@/features/language-switcher';

export function Header() {
  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 transition-colors duration-300">
      {/* Left: Brand Identity with Link to Root / Dashboard */}
      <Link
        to="/"
        className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 cursor-pointer group transition-transform active:scale-98"
        title="Return to Runawulf Dashboard (/)"
      >
        <img
          src="/runawulf.svg"
          alt="Runawulf Emblem"
          className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-[0_0_12px_var(--accent)] group-hover:drop-shadow-[0_0_18px_var(--accent)] transition-all duration-300"
        />
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-mono font-extrabold tracking-widest text-sm sm:text-lg text-white group-hover:text-cyan-300 transition-colors">
            RUNAWULF
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono rounded-none bg-slate-800 text-slate-400 border border-slate-700/60">
            v2.0
          </span>
        </div>
      </Link>

      {/* Center: Central Cyber-Dock Mode Switcher */}
      <div className="flex items-center justify-center flex-1 max-w-xl mx-auto px-1">
        <ModeSegmentedControl />
      </div>

      {/* Right: Language Selector */}
      <div className="flex items-center justify-end flex-shrink-0">
        <LanguageSwitcher />
      </div>
    </header>
  );
}
