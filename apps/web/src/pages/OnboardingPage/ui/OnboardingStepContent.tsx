/**
 * @file OnboardingStepContent.tsx
 * @description Form components for the 4 setup steps: Network Interface, Suricata EVE, Defense Posture, and Cryptographic Key.
 */

import { Network, Radio, ShieldAlert, Key, CheckCircle2 } from 'lucide-react';
import type { OperationModeId } from '@/entities/mode';

interface OnboardingStepContentProps {
  currentStep: 1 | 2 | 3 | 4;
  selectedInterface: string;
  setSelectedInterface: (iface: string) => void;
  evePath: string;
  setEvePath: (path: string) => void;
  initialPosture: OperationModeId;
  setInitialPosture: (posture: OperationModeId) => void;
  t: {
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    evePathLabel: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    hmacKeyReady: string;
    completeNotice: string;
  };
}

export function OnboardingStepContent({
  currentStep,
  selectedInterface,
  setSelectedInterface,
  evePath,
  setEvePath,
  initialPosture,
  setInitialPosture,
  t,
}: OnboardingStepContentProps) {
  return (
    <div className="flex-1 space-y-4">
      {/* STEP 1: NETWORK & KERNEL */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" />
              <span>{t.step1Title}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{t.step1Desc}</p>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {[
              {
                id: 'ens3',
                ip: '192.168.1.100',
                speed: '1000 Mbps Full Duplex',
                tag: 'RECOMMENDED',
              },
              {
                id: 'eth0',
                ip: 'Unassigned',
                speed: 'Link down',
                tag: 'NO CARRIER',
              },
              {
                id: 'docker0',
                ip: '172.17.0.1',
                speed: 'Virtual Bridge',
                tag: 'INVARIANT I4 ISOLATED',
              },
            ].map((iface) => (
              <label
                key={iface.id}
                className={`flex items-center justify-between p-2.5 border transition-colors cursor-pointer ${
                  selectedInterface === iface.id
                    ? 'bg-cyan-950/50 border-cyan-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="net_iface"
                    checked={selectedInterface === iface.id}
                    onChange={() => setSelectedInterface(iface.id)}
                    className="accent-cyan-400"
                  />
                  <div>
                    <div className="font-bold text-white text-xs">{iface.id}</div>
                    <div className="text-[10px] text-slate-400">
                      {iface.ip} • {iface.speed}
                    </div>
                  </div>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 border border-slate-700 bg-slate-900 text-slate-300">
                  {iface.tag}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: SURICATA EVE */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              <span>{t.step2Title}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{t.step2Desc}</p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                {t.evePathLabel}:
              </label>
              <input
                type="text"
                value={evePath}
                onChange={(e) => setEvePath(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-2 text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="p-3 border border-slate-800 bg-slate-950 space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Suricata Daemon:</span>
                <span className="text-emerald-400 font-bold">ACTIVE (PID 1842)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Signatures Ingested:</span>
                <span className="text-amber-400 font-bold">24,192 ET Open Rules</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: INITIAL DEFENSE POSTURE */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>{t.step3Title}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{t.step3Desc}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
            <button
              type="button"
              onClick={() => setInitialPosture('guardian')}
              className={`p-3 border text-left transition-all cursor-pointer ${
                initialPosture === 'guardian'
                  ? 'bg-cyan-950/60 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-cyan-400">ᛉ GUARDIAN</span>
                <span className="text-[9px] px-1 py-0.2 bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  RECOMMENDED
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                Autonomous mitigation. Suricata alerts trigger instant nftables quarantine.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setInitialPosture('watcher')}
              className={`p-3 border text-left transition-all cursor-pointer ${
                initialPosture === 'watcher'
                  ? 'bg-amber-950/60 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-amber-400">ᛟ WATCHER</span>
                <span className="text-[9px] px-1 py-0.2 bg-amber-950 text-amber-300 border border-amber-500/40">
                  AUDIT ONLY
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                Passive sentinel. Telemetry and alerts recorded to audit.db without firewall mutation.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CRYPTOGRAPHIC SEED & ARM */}
      {currentStep === 4 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-400" />
              <span>{t.step4Title}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{t.step4Desc}</p>
          </div>

          <div className="p-3 border border-slate-800 bg-slate-950 space-y-1.5 font-mono text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.hmacKeyReady}</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Permissions 0600 enforced by runawulf-helper. Anchor: journald stream active.
            </div>
          </div>

          <div className="p-2.5 border border-cyan-500/40 bg-cyan-950/30 text-xs font-mono text-cyan-300">
            {t.completeNotice}
          </div>
        </div>
      )}
    </div>
  );
}
