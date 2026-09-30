/**
 * @file FirewallPage.tsx
 * @description Dedicated Algiz Declarative Firewall management page (scoped to table inet runawulf).
 */

import { ShieldAlert, Plus, RefreshCw, Clock, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/app/providers/LanguageProvider';

export function FirewallPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold font-mono text-white tracking-wide">
              {t.nav.firewall}
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Scoped strictly to kernel table: <span className="text-cyan-300">table inet runawulf</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1.5 border border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Flush Table</span>
          </button>
          <button
            type="button"
            className="px-3.5 py-1.5 border border-cyan-500 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.3)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Rule</span>
          </button>
        </div>
      </div>

      {/* Invariants & Watchdog Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 border border-slate-800 bg-slate-900/60 space-y-1">
          <div className="text-slate-400 text-[10px]">INVARIANT I4 STATUS</div>
          <div className="text-emerald-400 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>ISOLATED FROM DOCKER/UFW</span>
          </div>
        </div>

        <div className="p-4 border border-slate-800 bg-slate-900/60 space-y-1">
          <div className="text-slate-400 text-[10px]">INVARIANT I5 WATCHDOG</div>
          <div className="text-cyan-400 font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>30S ROOT ROLLBACK ARMED</span>
          </div>
        </div>

        <div className="p-4 border border-slate-800 bg-slate-900/60 space-y-1">
          <div className="text-slate-400 text-[10px]">TOTAL DROPPED PACKETS</div>
          <div className="text-white font-bold text-base">42,891 pkts</div>
        </div>
      </div>

      {/* Dynamic Sets Table */}
      <div className="border border-slate-800 bg-slate-900/80 overflow-hidden font-mono text-xs">
        <div className="p-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="font-bold text-white">ACTIVE DYNAMIC SETS</span>
          <span className="text-slate-400 text-[11px]">3 sets synced</span>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">SET NAME</th>
              <th className="py-2.5 px-3">TYPE</th>
              <th className="py-2.5 px-3">POLICY ACTION</th>
              <th className="py-2.5 px-3">ELEMENTS</th>
              <th className="py-2.5 px-3 text-right">TIMEOUT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            <tr className="hover:bg-slate-800/40">
              <td className="py-2.5 px-3 text-cyan-400 font-bold">denylist_v4</td>
              <td className="py-2.5 px-3">ipv4_addr</td>
              <td className="py-2.5 px-3">
                <span className="px-1.5 py-0.5 bg-red-950 text-red-400 border border-red-500/30 text-[10px]">
                  DROP
                </span>
              </td>
              <td className="py-2.5 px-3">24 items</td>
              <td className="py-2.5 px-3 text-right text-slate-400">1h auto-expire</td>
            </tr>
            <tr className="hover:bg-slate-800/40">
              <td className="py-2.5 px-3 text-cyan-400 font-bold">denylist_v6</td>
              <td className="py-2.5 px-3">ipv6_addr</td>
              <td className="py-2.5 px-3">
                <span className="px-1.5 py-0.5 bg-red-950 text-red-400 border border-red-500/30 text-[10px]">
                  DROP
                </span>
              </td>
              <td className="py-2.5 px-3">4 items</td>
              <td className="py-2.5 px-3 text-right text-slate-400">1h auto-expire</td>
            </tr>
            <tr className="hover:bg-slate-800/40">
              <td className="py-2.5 px-3 text-emerald-400 font-bold">rate_limit_ssh</td>
              <td className="py-2.5 px-3">ipv4_addr</td>
              <td className="py-2.5 px-3">
                <span className="px-1.5 py-0.5 bg-amber-950 text-amber-400 border border-amber-500/30 text-[10px]">
                  THROTTLE
                </span>
              </td>
              <td className="py-2.5 px-3">3 items</td>
              <td className="py-2.5 px-3 text-right text-slate-400">10m burst window</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
