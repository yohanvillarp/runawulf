/**
 * @file OnboardingSentinelPanel.tsx
 * @description Left column sentinel cockpit panel featuring the reactive Cyber-Wolf and diagnostic bus metrics.
 */

import { RunicWolfVector } from '@/features/posture-transition/ui/RunicWolfVector';
import { Terminal } from 'lucide-react';

interface StepMeta {
  num: 1 | 2 | 3 | 4;
  rune: string;
  color: string;
  label: string;
}

interface OnboardingSentinelPanelProps {
  currentStep: 1 | 2 | 3 | 4;
  activeStepMeta: StepMeta;
  glowSurge: boolean;
  shockwave: boolean;
}

export function OnboardingSentinelPanel({
  currentStep,
  activeStepMeta,
  glowSurge,
  shockwave,
}: OnboardingSentinelPanelProps) {
  return (
    <div className="lg:col-span-5 p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-2xl">
      {/* Ambient Watermark Rune */}
      <div className="absolute top-2 right-3 font-serif text-3xl text-slate-800 select-none pointer-events-none">
        {activeStepMeta.rune}
      </div>

      {/* Top Indicator */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono border-b border-slate-800/80 pb-3">
        <span className="text-slate-400 flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          GUARDIAN ENGINE
        </span>
        <span
          className="font-bold uppercase tracking-wider"
          style={{ color: activeStepMeta.color }}
        >
          PHASE 0{currentStep} / 04
        </span>
      </div>

      {/* The Cyber-Wolf: Pulses with energy surge on each step */}
      <div className="py-4 my-auto relative">
        <RunicWolfVector
          accentColor={activeStepMeta.color}
          rune={activeStepMeta.rune}
          runeName={activeStepMeta.label}
          isGlowSurge={glowSurge}
          isShockwaveActive={shockwave}
          showLabel={false}
          sizeClassName="w-40 h-40 sm:w-48 sm:h-48"
        />

        <div className="mt-3">
          <span
            className="font-mono text-xs font-bold px-3 py-1 border bg-slate-950/90 tracking-widest uppercase transition-colors duration-300"
            style={{
              color: activeStepMeta.color,
              borderColor: `${activeStepMeta.color}60`,
              boxShadow: `0 0 12px ${activeStepMeta.color}25`,
            }}
          >
            {activeStepMeta.rune} {activeStepMeta.label}
          </span>
        </div>
      </div>

      {/* Bottom Host Handshake Diagnostic */}
      <div className="w-full pt-3 border-t border-slate-800/80 text-left font-mono text-[11px] space-y-1.5 text-slate-400">
        <div className="flex items-center justify-between">
          <span>Kernel nftables scope:</span>
          <span className="text-cyan-400 font-semibold">table inet runawulf</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Helper IPC Peercred:</span>
          <span className="text-emerald-400 font-semibold">VERIFIED (UID 0)</span>
        </div>
      </div>
    </div>
  );
}
