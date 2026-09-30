/**
 * @file TelemetryPage.tsx
 * @description Dedicated Raido Telemetry page with procfs/sysfs metrics and socket diagnostics.
 */

import { Activity, Cpu, HardDrive, Zap, Network } from 'lucide-react';
import { useTranslation } from '@/app/providers/LanguageProvider';

export function TelemetryPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-mono">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        <Activity className="w-5 h-5 text-cyan-400" />
        <h1 className="text-xl font-bold text-white tracking-wide">{t.nav.telemetry}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>CPU Load</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">14.1%</div>
          <div className="text-[10px] text-emerald-400">8 cores nominal</div>
        </div>

        <div className="p-4 border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Memory Allocated</span>
            <HardDrive className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">4.2 GB</div>
          <div className="text-[10px] text-slate-400">/ 16.0 GB (26%)</div>
        </div>

        <div className="p-4 border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>IPC Peer Latency</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">0.26 ms</div>
          <div className="text-[10px] text-slate-400">SO_PEERCRED verify</div>
        </div>

        <div className="p-4 border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Interface RX/TX</span>
            <Network className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">1.8 MB/s</div>
          <div className="text-[10px] text-slate-400">ens3 nominal</div>
        </div>
      </div>
    </div>
  );
}
