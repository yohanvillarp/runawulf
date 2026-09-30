/**
 * @file OnboardingAwakeningOverlay.tsx
 * @description Full-screen cinematic awakening sequence overlay with gyro rune rings and terminal telemetry.
 */

import { RuneGyroscope } from '@/features/posture-transition/ui/RuneGyroscope';
import { RunicWolfVector } from '@/features/posture-transition/ui/RunicWolfVector';
import { Sparkles } from 'lucide-react';

interface OnboardingAwakeningOverlayProps {
  awakeningStage: 1 | 2 | 3;
  selectedInterface: string;
  glowSurge: boolean;
  shockwave: boolean;
}

export function OnboardingAwakeningOverlay({
  awakeningStage,
  selectedInterface,
  glowSurge,
  shockwave,
}: OnboardingAwakeningOverlayProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden animate-in fade-in duration-500">
      {/* Ambient Radial Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(6,182,212,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-lg">
        {/* Center Wolf with Rotating Rune Gyroscope */}
        <div className="relative flex items-center justify-center">
          <div className="absolute scale-110 sm:scale-125">
            <RuneGyroscope accentColor="#06b6d4" size={320} />
          </div>

          <RunicWolfVector
            accentColor="#06b6d4"
            rune="ᚱ"
            runeName="Raido (Awakened)"
            isGlowSurge={glowSurge}
            isShockwaveActive={shockwave}
            showLabel={false}
            sizeClassName="w-48 h-48 sm:w-56 sm:h-56"
          />
        </div>

        {/* Cinematic Telemetry Terminal readout */}
        <div className="w-full bg-slate-950/90 border border-cyan-500/50 p-4 shadow-[0_0_24px_rgba(6,182,212,0.25)] space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5 text-[10px]">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              INITIALIZING RUNAWULF ENGINE
            </span>
            <span className="text-emerald-400">
              {awakeningStage === 1 ? 'STAGE 1/3' : awakeningStage === 2 ? 'STAGE 2/3' : 'ONLINE'}
            </span>
          </div>

          <div className="text-left text-white py-1">
            {awakeningStage === 1 && (
              <p className="text-cyan-300 animate-pulse truncate">
                [01/03] BINDING TABLE INET RUNAWULF TO {selectedInterface.toUpperCase()}...
              </p>
            )}
            {awakeningStage === 2 && (
              <p className="text-amber-300 animate-pulse truncate">
                [02/03] ANCHORING HMAC-SHA256 LEDGER TO JOURNALD STREAM...
              </p>
            )}
            {awakeningStage >= 3 && (
              <p className="text-emerald-400 font-bold truncate">
                [03/03] POSTURE COMMITTED • ENTERING LOCAL CONTROL PLANE...
              </p>
            )}
          </div>

          {/* Progress Track */}
          <div className="w-full bg-slate-800 h-1.5 overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-700 ease-out shadow-[0_0_8px_#06b6d4]"
              style={{
                width: awakeningStage === 1 ? '35%' : awakeningStage === 2 ? '75%' : '100%',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
