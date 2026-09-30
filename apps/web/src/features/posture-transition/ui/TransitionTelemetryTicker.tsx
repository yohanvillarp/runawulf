/**
 * @file TransitionTelemetryTicker.tsx
 * @description Enterprise terminal ticker displaying kernel security transitions during posture switch with sharp square aesthetics.
 */

import { Terminal, Shield, CheckCircle2 } from 'lucide-react';
import type { TransitionPhase } from '../model/types.js';

interface TransitionTelemetryTickerProps {
  phase: TransitionPhase;
  targetModeName: string;
  accentColor: string;
}

export function TransitionTelemetryTicker({
  phase,
  targetModeName,
  accentColor,
}: TransitionTelemetryTickerProps) {
  const getStepData = () => {
    switch (phase) {
      case 'ipc_verify':
        return {
          step: '01/03',
          message: 'VERIFYING HELPER SO_PEERCRED IPC AUTHENTICATION...',
          progress: 33,
        };
      case 'kernel_reconfig':
        return {
          step: '02/03',
          message: 'RECONFIGURING TABLE INET RUNAWULF DYNAMIC SETS...',
          progress: 66,
        };
      case 'posture_commit':
      case 'completed':
        return {
          step: '03/03',
          message: `POSTURE COMMITTED: ${targetModeName.toUpperCase()} ENFORCEMENT ARMED`,
          progress: 100,
        };
      default:
        return {
          step: '00/03',
          message: 'INITIALIZING POSTURE MUTATION HANDSHAKE...',
          progress: 10,
        };
    }
  };

  const current = getStepData();

  return (
    <div className="w-full max-w-md bg-slate-950 rounded-none border border-slate-800 p-4 shadow-2xl space-y-3 font-mono">
      {/* Console Header */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-300">SECURITY POSTURE HANDSHAKE</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span
            className="w-1.5 h-1.5 rounded-none rotate-45 animate-pulse"
            style={{ backgroundColor: accentColor }}
          />
          <span style={{ color: accentColor }}>LIVE</span>
        </div>
      </div>

      {/* Console Step Line */}
      <div className="flex items-start gap-2.5 text-xs">
        {phase === 'posture_commit' || phase === 'completed' ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        ) : (
          <Shield
            className="w-4 h-4 flex-shrink-0 mt-0.5 animate-spin"
            style={{ color: accentColor }}
          />
        )}
        <div className="space-y-0.5 flex-1 min-w-0">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>PHASE {current.step}</span>
            <span>{current.progress}%</span>
          </div>
          <p className="text-slate-200 text-xs font-semibold tracking-wide truncate">
            {current.message}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-none overflow-hidden">
        <div
          className="h-full rounded-none transition-all duration-300 ease-out"
          style={{
            width: `${current.progress}%`,
            backgroundColor: accentColor,
            boxShadow: `0 0 10px ${accentColor}`,
          }}
        />
      </div>
    </div>
  );
}
