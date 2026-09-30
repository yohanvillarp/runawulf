/**
 * @file SettingsPage.tsx
 * @description Dedicated System Settings page with initial setup re-run trigger.
 */

import { Settings, RefreshCw, Key } from 'lucide-react';
import { useTranslation } from '@/app/providers/LanguageProvider';

interface SettingsPageProps {
  onRerunSetup: () => void;
}

export function SettingsPage({ onRerunSetup }: SettingsPageProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-mono">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        <Settings className="w-5 h-5 text-slate-300" />
        <h1 className="text-xl font-bold text-white tracking-wide">{t.nav.settings}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Onboarding Wizard Re-run */}
        <div className="p-5 border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <RefreshCw className="w-4 h-4" />
            <span>HOST SETUP & VERIFICATION WIZARD</span>
          </div>
          <p className="text-slate-400 font-sans">
            Re-run the initial 4-step Runic Awakening wizard to change your primary network
            interface, Suricata log path, or cryptographic audit ledger seed.
          </p>
          <button
            type="button"
            onClick={onRerunSetup}
            className="px-4 py-2 border border-cyan-500 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-mono font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.3)]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-run Setup Wizard</span>
          </button>
        </div>

        {/* Security Policy & Cryptographic Keys */}
        <div className="p-5 border border-slate-800 bg-slate-900/60 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Key className="w-4 h-4" />
            <span>ROOT SECURITY KEYS & AUDIT ANCHOR</span>
          </div>
          <p className="text-slate-400 font-sans">
            HMAC-SHA256 signatures are sealed in root space by runawulf-helper. The key is isolated
            from daemon memory (Invariant I6).
          </p>
          <div className="p-2.5 bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
            <span>audit.key path:</span>
            <span className="text-cyan-300">/etc/runawulf/audit.key (0600)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
