/**
 * @file IntrusionPage.tsx
 * @description Dedicated Eiwaz Intrusion Detection System page with Suricata live logs.
 */

import { Radio, ShieldAlert, Filter, Download } from 'lucide-react';
import { useTranslation } from '@/app/providers/LanguageProvider';

export function IntrusionPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold font-mono text-white tracking-wide">
              {t.nav.intrusion}
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Engine: Suricata 7.0.2 • Stream: <span className="text-amber-300">/var/log/suricata/eve.json</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1.5 border border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
          <button
            type="button"
            className="px-3.5 py-1.5 border border-amber-500 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.3)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export EVE JSON</span>
          </button>
        </div>
      </div>

      <div className="p-4 border border-slate-800 bg-slate-900/60 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Signatures Loaded (ET Open Community Ruleset)
          </span>
          <span className="text-amber-300 font-bold">24,192 signatures active</span>
        </div>
        <p className="text-slate-400 text-[11px]">
          Suricata follower runs under unprivileged daemon boundaries with strict buffer limits (Invariant I9).
        </p>
      </div>
    </div>
  );
}
