/**
 * @file ModeDropdown.tsx
 * @description Enterprise posture selector dropdown integrating defense mode and visual theme.
 */

import { useState, useRef, useEffect } from 'react';
import { useOperationMode } from '@/app/providers/ModeProvider';
import { useTranslation } from '@/app/providers/LanguageProvider';
import { Shield, Eye, Flame, ChevronDown, Check } from 'lucide-react';
import type { OperationModeId } from '@/entities/mode';

export function ModeDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { operationMode, setOperationModeId, availableOperationModes } = useOperationMode();
  const { t } = useTranslation();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getModeIcon = (id: OperationModeId, className = 'w-4 h-4') => {
    switch (id) {
      case 'guardian':
        return <Shield className={className} />;
      case 'watcher':
        return <Eye className={className} />;
      case 'lockdown':
        return <Flame className={className} />;
    }
  };

  const getModeBadgeClass = (id: OperationModeId) => {
    switch (id) {
      case 'guardian':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20';
      case 'watcher':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20';
      case 'lockdown':
        return 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20';
    }
  };

  const getDotColorClass = (id: OperationModeId) => {
    switch (id) {
      case 'guardian':
        return 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]';
      case 'watcher':
        return 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]';
      case 'lockdown':
        return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)] animate-pulse';
    }
  };

  const currentModeInfo = t.modes[operationMode.id];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Enterprise Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 cursor-pointer ${getModeBadgeClass(
          operationMode.id
        )}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={t.header.switchPosture}
      >
        <span className={`w-2 h-2 rounded-full ${getDotColorClass(operationMode.id)}`} />
        <span className="flex items-center gap-1.5 font-semibold tracking-wide uppercase">
          {getModeIcon(operationMode.id, 'w-3.5 h-3.5')}
          {currentModeInfo.name}
        </span>
        <span className="text-[10px] opacity-75 font-mono px-1 rounded bg-black/20 border border-white/5">
          {operationMode.rune}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Enterprise Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/70 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3.5 py-2.5 border-b border-slate-800/80 bg-slate-950/40">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {t.header.switchPosture}
            </p>
          </div>

          <div className="p-1.5 space-y-1">
            {availableOperationModes.map((mode) => {
              const modeTranslation = t.modes[mode.id];
              const isSelected = mode.id === operationMode.id;

              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => {
                    setOperationModeId(mode.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg flex items-start justify-between gap-3 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 text-white'
                      : 'hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`mt-0.5 p-1.5 rounded-md border text-xs ${
                        mode.id === 'guardian'
                          ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
                          : mode.id === 'watcher'
                          ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                          : 'border-red-500/30 bg-red-500/10 text-red-400'
                      }`}
                    >
                      {getModeIcon(mode.id, 'w-4 h-4')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">{modeTranslation.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {mode.rune} {mode.runeName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {modeTranslation.tagline}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
