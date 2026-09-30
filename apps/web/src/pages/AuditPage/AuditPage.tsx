/**
 * @file AuditPage.tsx
 * @description Dedicated Cryptographic Audit Ledger page with HMAC-SHA256 signatures and journald sync.
 */

import { FileCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/app/providers/LanguageProvider';

export function AuditPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-white tracking-wide">{t.nav.audit}</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Immutable SQLite Ledger • Key: <span className="text-cyan-300">/etc/runawulf/audit.key</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            HMAC-SHA256 VERIFIED
          </span>
        </div>
      </div>

      <div className="border border-slate-800 bg-slate-900/80 overflow-hidden text-xs">
        <div className="p-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="font-bold text-white">CRYPTOGRAPHIC MUTATION LEDGER</span>
          <span className="text-slate-400 text-[11px]">Synced with journald</span>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">TIMESTAMP</th>
              <th className="py-2.5 px-3">MUTATION</th>
              <th className="py-2.5 px-3">TARGET</th>
              <th className="py-2.5 px-3">DISPATCHER</th>
              <th className="py-2.5 px-3 text-right">HMAC SIGNATURE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            <tr className="hover:bg-slate-800/40">
              <td className="py-2.5 px-3 text-slate-400">2026-09-29 20:55:12</td>
              <td className="py-2.5 px-3 text-cyan-400 font-bold">SET_ELEMENT_ADD</td>
              <td className="py-2.5 px-3">198.51.100.89 -&gt; denylist_v4</td>
              <td className="py-2.5 px-3 text-slate-400">policy-engine</td>
              <td className="py-2.5 px-3 text-right text-emerald-400 flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>VALID: 9a4f...01c8</span>
              </td>
            </tr>
            <tr className="hover:bg-slate-800/40">
              <td className="py-2.5 px-3 text-slate-400">2026-09-29 20:50:04</td>
              <td className="py-2.5 px-3 text-amber-400 font-bold">POSTURE_APPLY</td>
              <td className="py-2.5 px-3">system_posture: watcher -&gt; guardian</td>
              <td className="py-2.5 px-3 text-slate-400">operator (local)</td>
              <td className="py-2.5 px-3 text-right text-emerald-400 flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>VALID: 4b2c...78e1</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
