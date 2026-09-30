/**
 * @file PostureTransitionOverlay.tsx
 * @description Fullscreen immersive posture transition overlay featuring The Runic Wolf (Fenrir Awakening).
 */

import { RuneGyroscope } from './RuneGyroscope.js';
import { RunicWolfVector } from './RunicWolfVector.js';
import { TransitionTelemetryTicker } from './TransitionTelemetryTicker.js';
import type { TransitionPhase } from '../model/types.js';
import { OPERATION_MODES, type OperationModeId } from '@/entities/mode';

interface PostureTransitionOverlayProps {
  isOpen: boolean;
  targetModeId: OperationModeId | null;
  phase: TransitionPhase;
  isShockwaveActive: boolean;
}

export function PostureTransitionOverlay({
  isOpen,
  targetModeId,
  phase,
  isShockwaveActive,
}: PostureTransitionOverlayProps) {
  if (!isOpen || !targetModeId) return null;

  const targetMode = OPERATION_MODES.find((m) => m.id === targetModeId) ?? OPERATION_MODES[0];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-slate-950/85 backdrop-blur-2xl transition-opacity duration-300 animate-in fade-in">
      {/* Background Radial Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${targetMode.accentColor}15 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-lg w-full">
        {/* Centerpiece: Rune Gyroscope + Runic Cyber-Wolf */}
        <div className="relative flex items-center justify-center">
          {/* Concentric rotating rune gyroscope */}
          <div className="absolute">
            <RuneGyroscope accentColor={targetMode.accentColor} size={340} />
          </div>

          {/* Polyhedral Norse Wolf */}
          <RunicWolfVector
            accentColor={targetMode.accentColor}
            rune={targetMode.rune}
            runeName={targetMode.runeName}
            isShockwaveActive={isShockwaveActive}
          />
        </div>

        {/* Security Telemetry Console */}
        <TransitionTelemetryTicker
          phase={phase}
          targetModeName={targetMode.id}
          accentColor={targetMode.accentColor}
        />
      </div>
    </div>
  );
}
