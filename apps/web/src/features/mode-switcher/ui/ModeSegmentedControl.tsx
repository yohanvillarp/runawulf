/**
 * @file ModeSegmentedControl.tsx
 * @description Centralized cyber-dock with Norse Runes as primary identity glyphs (no generic icons).
 */

import { useOperationMode } from '@/app/providers/ModeProvider';
import { useTranslation } from '@/app/providers/LanguageProvider';

export function ModeSegmentedControl() {
  const { operationMode, setOperationModeId, availableOperationModes, isTransitioning } =
    useOperationMode();
  const { t } = useTranslation();

  const getActiveClass = (id: string) => {
    switch (id) {
      case 'guardian':
        return 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.4)]';
      case 'watcher':
        return 'bg-amber-950 text-amber-300 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]';
      case 'lockdown':
        return 'bg-red-950 text-red-300 border-red-500 shadow-[0_0_14px_rgba(239,68,68,0.5)]';
      default:
        return '';
    }
  };

  const getDotClass = (id: string) => {
    switch (id) {
      case 'guardian':
        return 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]';
      case 'watcher':
        return 'bg-amber-400 shadow-[0_0_8px_#f59e0b]';
      case 'lockdown':
        return 'bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse';
      default:
        return '';
    }
  };

  return (
    <div
      className="inline-flex items-center p-0.5 rounded-none bg-slate-950 border border-slate-800 shadow-inner"
      role="group"
      aria-label="Security Posture Selector"
    >
      {availableOperationModes.map((mode) => {
        const isActive = mode.id === operationMode.id;
        const modeInfo = t.modes[mode.id];

        return (
          <button
            key={mode.id}
            type="button"
            disabled={isTransitioning}
            onClick={() => setOperationModeId(mode.id)}
            title={`${modeInfo.name}: ${modeInfo.tagline}`}
            className={`relative flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-none text-xs font-mono transition-all duration-150 cursor-pointer border ${
              isActive
                ? `${getActiveClass(mode.id)} font-bold`
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            } disabled:cursor-wait`}
          >
            {/* Active Square/Diamond Pulse Dot */}
            {isActive && (
              <span
                className={`w-1.5 h-1.5 rounded-none rotate-45 ${getDotClass(mode.id)} flex-shrink-0`}
              />
            )}

            {/* The Rune IS the primary icon */}
            <span
              className={`font-serif text-sm leading-none transition-colors ${
                isActive ? 'text-white' : 'text-slate-500'
              }`}
            >
              {mode.rune}
            </span>

            {/* Mode Name (Hidden on small mobile viewports) */}
            <span className="hidden sm:inline tracking-wider uppercase font-semibold">
              {modeInfo.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
