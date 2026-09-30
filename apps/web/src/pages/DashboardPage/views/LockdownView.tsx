/**
 * @file LockdownView.tsx
 * @description Emergency Containment Deck view for Lockdown mode.
 * Crisis response interface featuring strict isolation controls, rollback watchdog countdown, and quarantine matrix with sharp square aesthetics.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from '@/app/providers/LanguageProvider';
import { useOperationMode } from '@/app/providers/ModeProvider';
import {
  Flame,
  RotateCcw,
  Check,
  ShieldCheck,
  Ban,
  Clock,
  Unlock,
} from 'lucide-react';

export function LockdownView() {
  const { t } = useTranslation();
  const { setOperationModeId } = useOperationMode();
  const v = t.views.lockdown;

  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [isCommitted, setIsCommitted] = useState(false);

  // Watchdog timer simulation (Invariant I5: 30s auto-revert in root space)
  useEffect(() => {
    if (isCommitted) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setOperationModeId('guardian'); // Auto-rollback
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCommitted, setOperationModeId]);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-98 duration-300">
      {/* 1. Crisis Alert Banner */}
      <section className="relative overflow-hidden rounded-none border-2 border-red-500/70 bg-gradient-to-br from-red-950/50 via-slate-950 to-slate-950 p-6 shadow-[0_0_30px_rgba(239,68,68,0.25)]">
        <div className="absolute top-3 right-4 font-serif text-3xl text-red-500/20 select-none pointer-events-none">
          ᛏ ᛏ ᛏ
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-none text-[11px] font-mono font-bold tracking-wider uppercase bg-red-500/20 text-red-400 border border-red-500/60 shadow-[0_0_10px_rgba(239,68,68,0.4)] animate-pulse flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                {v.badge}
              </span>
              <span className="text-xs font-mono text-red-300/80">INVARIANT I4 & I5 ACTIVE</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
              <span>{v.title}</span>
            </h2>

            <p className="text-xs sm:text-sm text-red-200/90 leading-relaxed font-sans">
              {v.alertMessage}
            </p>
          </div>

          {/* Root-Owned Rollback Watchdog Countdown (Invariant I5) */}
          <div className="p-4 rounded-none bg-slate-950 border border-red-500/50 min-w-[280px] shadow-2xl">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span className="flex items-center gap-1.5 text-red-400">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                ROOT WATCHDOG
              </span>
              <span className="text-[10px] text-slate-500">I5 ENFORCED</span>
            </div>

            {!isCommitted ? (
              <div>
                <div className="text-[11px] text-slate-300 font-mono mt-1">
                  {v.rollbackSecondsRemaining}
                </div>
                <div className="text-3xl font-extrabold font-mono text-red-400 mt-1 flex items-baseline gap-2">
                  <span>{secondsRemaining}s</span>
                  <span className="text-xs text-red-400/70 font-normal">auto-revert</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-none mt-2 overflow-hidden">
                  <div
                    className="bg-red-500 h-full rounded-none transition-all duration-1000 ease-linear shadow-[0_0_8px_#ef4444]"
                    style={{ width: `${(secondsRemaining / 30) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="py-2 flex items-center gap-2 text-emerald-400 font-mono text-xs">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>POSTURE PERMANENTLY COMMITTED</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsCommitted(true)}
                disabled={isCommitted}
                className="px-2.5 py-1.5 rounded-none bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Commit</span>
              </button>

              <button
                type="button"
                onClick={() => setOperationModeId('guardian')}
                className="px-2.5 py-1.5 rounded-none bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500/20 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Rollback</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Isolation Control Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Quarantine Matrix */}
        <div className="p-5 rounded-none border border-red-500/30 bg-slate-900/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Ban className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-bold text-white font-mono">{v.quarantineTitle}</h3>
            </div>
            <span className="text-[10px] font-mono text-red-400 px-2 py-0.5 rounded-none bg-red-950/60 border border-red-500/40">
              STRICT DROP ACTIVE
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 rounded-none bg-slate-950 border border-red-500/20 flex items-center justify-between">
              <div>
                <div className="text-white font-semibold">ALL INCOMING PACKETS</div>
                <div className="text-[11px] text-slate-400">table inet runawulf drop_unwhitelisted</div>
              </div>
              <span className="text-red-400 font-bold px-2 py-1 bg-red-950/50 rounded-none border border-red-500/30">
                DROPPING
              </span>
            </div>

            <div className="p-3 rounded-none bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-white font-semibold">TOTAL QUARANTINED HOSTS</div>
                <div className="text-[11px] text-slate-400">denylist_v4 dynamic kernel set</div>
              </div>
              <span className="text-red-400 font-bold text-base">28 HOSTS</span>
            </div>
          </div>
        </div>

        {/* Local Management Channel Protection */}
        <div className="p-5 rounded-none border border-slate-800 bg-slate-900/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-mono">Whitelisted Admin Channels</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded-none bg-emerald-950/40 border border-emerald-500/30">
              PRESERVED
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 rounded-none bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-emerald-400 font-semibold">LOCAL SSH ACCESS</div>
                <div className="text-[11px] text-slate-400">TCP Port 22 (Enforced Rate-Limited)</div>
              </div>
              <span className="text-emerald-400 flex items-center gap-1">
                <Unlock className="w-3.5 h-3.5" />
                OPEN
              </span>
            </div>

            <div className="p-3 rounded-none bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-emerald-400 font-semibold">RUNAWULF LOCAL CONTROL PLANE</div>
                <div className="text-[11px] text-slate-400">Fastify Web Gateway (Port 4000)</div>
              </div>
              <span className="text-emerald-400 flex items-center gap-1">
                <Unlock className="w-3.5 h-3.5" />
                OPEN
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
