/**
 * @file GuardianView.tsx
 * @description Tactical Command Center view for Guardian mode (Nominal Active Defense).
 * Incorporates cyber-nordic polyhedral design with sharp square cards and glowing shields.
 */

import { useTranslation } from '@/app/providers/LanguageProvider';
import {
  ShieldAlert,
  Cpu,
  HardDrive,
  Zap,
  Activity,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';

export function GuardianView() {
  const { t } = useTranslation();
  const v = t.views.guardian;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-98 duration-300">
      {/* 1. Polyhedral Tactical Banner */}
      <section className="relative overflow-hidden rounded-none border border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-6 shadow-[0_0_24px_rgba(6,182,212,0.15)]">
        {/* Ambient Corner Runes */}
        <div className="absolute top-3 right-4 font-serif text-3xl text-cyan-400/20 select-none pointer-events-none">
          ᛉ ᛟ ᛏ
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-none text-[11px] font-mono font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                {v.badge}
              </span>
              <span className="text-xs font-mono text-cyan-300/70 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Algiz Core Armed
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-mono">
              <span>{v.title}</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {v.defenseNominal}
            </p>
          </div>

          {/* Quick Security Status */}
          <div className="flex items-center gap-3 p-3.5 rounded-none bg-slate-900 border border-slate-800 text-xs font-mono">
            <div className="p-2 rounded-none bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-white font-semibold">Autonomous Guard Loop</div>
              <div className="text-[11px] text-emerald-400">100% Nominally Protected</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Host Telemetry Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU */}
        <div className="p-4 rounded-none border border-slate-800 bg-slate-900/80 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono">{v.cpuTitle}</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">12.8%</span>
            <span className="text-[11px] text-emerald-400 font-mono">8 Cores</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-none mt-3 overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-none" style={{ width: '12.8%' }} />
          </div>
        </div>

        {/* Memory */}
        <div className="p-4 rounded-none border border-slate-800 bg-slate-900/80 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono">{v.memTitle}</span>
            <HardDrive className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">3.9 GB</span>
            <span className="text-[11px] text-slate-400 font-mono">/ 16.0 GB</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-none mt-3 overflow-hidden">
            <div className="bg-cyan-400/80 h-full rounded-none" style={{ width: '24%' }} />
          </div>
        </div>

        {/* IPC Socket */}
        <div className="p-4 rounded-none border border-slate-800 bg-slate-900/80 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono">{v.ipcTitle}</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">0.24 ms</span>
            <span className="text-[11px] text-slate-400 font-mono">SO_PEERCRED</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-2 truncate">
            runawulf-helper.socket
          </div>
        </div>

        {/* Load Average */}
        <div className="p-4 rounded-none border border-slate-800 bg-slate-900/80 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono">{v.loadTitle}</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">0.34</span>
            <span className="text-[11px] text-slate-400 font-mono">0.42 0.48</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-2 flex items-center gap-1">
            <span>●</span> Nominal Linux Load
          </div>
        </div>
      </section>

      {/* 3. Firewall & Threat Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Sets */}
        <div className="p-5 rounded-none border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-mono">{v.firewallOverview}</h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded-none bg-cyan-950/60 border border-cyan-500/30">
              table inet runawulf
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-none bg-slate-950 border border-slate-800 text-xs font-mono">
              <span className="text-slate-300">set denylist_v4 (IPv4 Isolation)</span>
              <span className="text-cyan-400 font-bold">24 entries</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-none bg-slate-950 border border-slate-800 text-xs font-mono">
              <span className="text-slate-300">set denylist_v6 (IPv6 Isolation)</span>
              <span className="text-cyan-400 font-bold">4 entries</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-none bg-slate-950 border border-slate-800 text-xs font-mono">
              <span className="text-slate-300">set rate_limit_ssh (Bruteforce Throttle)</span>
              <span className="text-emerald-400 font-bold">Active (10/min)</span>
            </div>
          </div>
        </div>

        {/* Protection Health */}
        <div className="p-5 rounded-none border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-mono">Mitigation Loop</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded-none bg-emerald-950/60 border border-emerald-500/30">
              I5 WATCHDOG ARMED
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-none bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Policy Engine Decision Matrix</span>
              <span className="text-cyan-400">Zero-Delay Async</span>
            </div>
            <div className="p-3 rounded-none bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Root Rollback Watchdog</span>
              <span className="text-emerald-400">30s Auto-Revert Guard</span>
            </div>
            <div className="p-3 rounded-none bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Cryptographic Ledger</span>
              <span className="text-cyan-300">HMAC-SHA256 Signed</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
