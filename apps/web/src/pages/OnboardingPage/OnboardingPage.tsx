/**
 * @file OnboardingPage.tsx
 * @description The Runic Awakening: 2-column cockpit layout for initial setup & host verification
 * with a cinematic full-screen awakening sequence transitioning smoothly into the main control plane.
 */

import { useState } from 'react';
import { useTranslation } from '@/app/providers/LanguageProvider';
import { useOperationMode } from '@/app/providers/ModeProvider';
import { LanguageSwitcher } from '@/features/language-switcher';
import { RunicWolfVector } from '@/features/posture-transition/ui/RunicWolfVector';
import { RuneGyroscope } from '@/features/posture-transition/ui/RuneGyroscope';
import {
  Network,
  Radio,
  ShieldAlert,
  Key,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Zap,
  Terminal,
  Sparkles,
} from 'lucide-react';
import type { OperationModeId } from '@/entities/mode';

interface OnboardingPageProps {
  onComplete: () => void;
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const { t } = useTranslation();
  const { setOperationModeId } = useOperationMode();
  const o = t.onboarding;

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedInterface, setSelectedInterface] = useState('ens3');
  const [evePath, setEvePath] = useState('/var/log/suricata/eve.json');
  const [initialPosture, setInitialPosture] = useState<OperationModeId>('guardian');
  const [glowSurge, setGlowSurge] = useState(false);
  const [shockwave, setShockwave] = useState(false);

  // Cinematic Awakening Sequence States
  const [isAwakening, setIsAwakening] = useState(false);
  const [awakeningStage, setAwakeningStage] = useState<1 | 2 | 3>(1);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Trigger brief 600ms energy pulse on the wolf when switching steps
  const triggerStepChange = (nextStep: 1 | 2 | 3 | 4) => {
    setCurrentStep(nextStep);
    setGlowSurge(true);
    setShockwave(true);

    setTimeout(() => {
      setGlowSurge(false);
      setShockwave(false);
    }, 600);
  };

  // Cinematic Awakening Orchestration
  const handleAwaken = () => {
    setIsAwakening(true);
    setGlowSurge(true);
    setShockwave(true);
    setOperationModeId(initialPosture);

    // Stage 1 -> 2: Synchronize kernel and audit
    setTimeout(() => {
      setAwakeningStage(2);
      setShockwave(true);
    }, 700);

    // Stage 2 -> 3: Full activation
    setTimeout(() => {
      setAwakeningStage(3);
      setShockwave(true);
    }, 1400);

    // Smooth Dissolve into Dashboard
    setTimeout(() => {
      setIsFadingOut(true);
    }, 2100);

    // Final Commit & Mount Dashboard
    setTimeout(() => {
      try {
        localStorage.setItem('runawulf_setup_completed', 'true');
      } catch {
        // Ignore
      }
      onComplete();
    }, 2800);
  };

  const steps = [
    { num: 1 as const, rune: 'ᛉ', color: '#06b6d4', label: o.step1Title, icon: Network },
    { num: 2 as const, rune: 'ᛇ', color: '#f59e0b', label: o.step2Title, icon: Radio },
    { num: 3 as const, rune: 'ᛟ', color: '#06b6d4', label: o.step3Title, icon: ShieldAlert },
    { num: 4 as const, rune: 'ᚱ', color: '#10b981', label: o.step4Title, icon: Key },
  ];

  const activeStepMeta = steps[currentStep - 1];

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-white transition-opacity duration-700 ${
        isFadingOut ? 'opacity-0 scale-102' : 'opacity-100 scale-100'
      }`}
    >
      {/* Top Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <img
            src="/runawulf.svg"
            alt="Runawulf Emblem"
            className="w-8 h-8 object-contain drop-shadow-[0_0_10px_#06b6d4]"
          />
          <div className="flex items-center gap-2 font-mono">
            <span className="font-extrabold tracking-widest text-base text-white">RUNAWULF</span>
            <span className="px-1.5 py-0.2 text-[9px] rounded-none bg-slate-900 text-cyan-400 border border-cyan-500/40">
              HOST AWAKENING
            </span>
          </div>
        </div>

        <LanguageSwitcher />
      </header>

      {/* FULL-SCREEN CINEMATIC AWAKENING OVERLAY */}
      {isAwakening ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden animate-in fade-in duration-500">
          {/* Ambient Radial Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(6,182,212,0.18) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-lg">
            {/* Center Wolf with Rotating Rune Gyroscope */}
            <div className="relative flex items-center justify-center">
              <div className="absolute scale-110 sm:scale-125">
                <RuneGyroscope accentColor="#06b6d4" size={320} />
              </div>

              <RunicWolfVector
                accentColor="#06b6d4"
                rune="ᚱ"
                runeName="Raido (Awakened)"
                isGlowSurge={glowSurge}
                isShockwaveActive={shockwave}
                showLabel={false}
                sizeClassName="w-48 h-48 sm:w-56 sm:h-56"
              />
            </div>

            {/* Cinematic Telemetry Terminal readout */}
            <div className="w-full bg-slate-950/90 border border-cyan-500/50 p-4 shadow-[0_0_24px_rgba(6,182,212,0.25)] space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5 text-[10px]">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  INITIALIZING RUNAWULF ENGINE
                </span>
                <span className="text-emerald-400">
                  {awakeningStage === 1 ? 'STAGE 1/3' : awakeningStage === 2 ? 'STAGE 2/3' : 'ONLINE'}
                </span>
              </div>

              <div className="text-left text-white py-1">
                {awakeningStage === 1 && (
                  <p className="text-cyan-300 animate-pulse truncate">
                    [01/03] BINDING TABLE INET RUNAWULF TO {selectedInterface.toUpperCase()}...
                  </p>
                )}
                {awakeningStage === 2 && (
                  <p className="text-amber-300 animate-pulse truncate">
                    [02/03] ANCHORING HMAC-SHA256 LEDGER TO JOURNALD STREAM...
                  </p>
                )}
                {awakeningStage >= 3 && (
                  <p className="text-emerald-400 font-bold truncate">
                    [03/03] POSTURE COMMITTED • ENTERING LOCAL CONTROL PLANE...
                  </p>
                )}
              </div>

              {/* Progress Track */}
              <div className="w-full bg-slate-800 h-1.5 overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-700 ease-out shadow-[0_0_8px_#06b6d4]"
                  style={{
                    width: awakeningStage === 1 ? '35%' : awakeningStage === 2 ? '75%' : '100%',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* STANDARD 2-COLUMN COCKPIT LAYOUT */
        <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
            {/* LEFT COLUMN: Runic Wolf Sentinel & Live Telemetry Meter (5 cols) */}
            <div className="lg:col-span-5 p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-2xl">
              {/* Ambient Watermark Rune */}
              <div className="absolute top-2 right-3 font-serif text-3xl text-slate-800 select-none pointer-events-none">
                {activeStepMeta.rune}
              </div>

              {/* Top Indicator */}
              <div className="w-full flex items-center justify-between text-[11px] font-mono border-b border-slate-800/80 pb-3">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  GUARDIAN ENGINE
                </span>
                <span
                  className="font-bold uppercase tracking-wider"
                  style={{ color: activeStepMeta.color }}
                >
                  PHASE 0{currentStep} / 04
                </span>
              </div>

              {/* The Cyber-Wolf: Pulses with energy surge on each step */}
              <div className="py-4 my-auto relative">
                <RunicWolfVector
                  accentColor={activeStepMeta.color}
                  rune={activeStepMeta.rune}
                  runeName={activeStepMeta.label}
                  isGlowSurge={glowSurge}
                  isShockwaveActive={shockwave}
                  showLabel={false}
                  sizeClassName="w-40 h-40 sm:w-48 sm:h-48"
                />

                <div className="mt-3">
                  <span
                    className="font-mono text-xs font-bold px-3 py-1 border bg-slate-950/90 tracking-widest uppercase transition-colors duration-300"
                    style={{
                      color: activeStepMeta.color,
                      borderColor: `${activeStepMeta.color}60`,
                      boxShadow: `0 0 12px ${activeStepMeta.color}25`,
                    }}
                  >
                    {activeStepMeta.rune} {activeStepMeta.label}
                  </span>
                </div>
              </div>

              {/* Bottom Host Handshake Diagnostic */}
              <div className="w-full pt-3 border-t border-slate-800/80 text-left font-mono text-[11px] space-y-1.5 text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Kernel nftables scope:</span>
                  <span className="text-cyan-400 font-semibold">table inet runawulf</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Helper IPC Peercred:</span>
                  <span className="text-emerald-400 font-semibold">VERIFIED (UID 0)</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Step Panel & Controls (7 cols) */}
            <div className="lg:col-span-7 p-6 bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-2xl">
              {/* Header Titles */}
              <div className="space-y-1 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                    INITIALIZATION
                  </span>
                  <h1 className="text-xl font-bold font-mono text-white tracking-wider">
                    {o.title}
                  </h1>
                </div>
                <p className="text-xs text-slate-400">{o.subtitle}</p>
              </div>

              {/* Dynamic Step Tab Bar */}
              <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-950 border border-slate-800 mb-5">
                {steps.map((s) => {
                  const isCurrent = currentStep === s.num;
                  const isCompleted = currentStep > s.num;

                  return (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => triggerStepChange(s.num)}
                      className={`py-1.5 px-2 text-center font-mono text-xs transition-all border cursor-pointer ${
                        isCurrent
                          ? 'bg-slate-900 border-cyan-500 text-cyan-300 font-bold shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                          : isCompleted
                          ? 'border-transparent text-emerald-400 hover:bg-slate-900'
                          : 'border-transparent text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <span className="font-serif mr-1">{s.rune}</span>
                      <span className="hidden sm:inline">0{s.num}.</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Step Content Body */}
              <div className="flex-1 space-y-4">
                {/* STEP 1: NETWORK & KERNEL */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div>
                      <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
                        <Network className="w-4 h-4 text-cyan-400" />
                        <span>{o.step1Title}</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">{o.step1Desc}</p>
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
                        <span>{o.step2Title}</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">{o.step2Desc}</p>
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                          {o.evePathLabel}:
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
                        <span>{o.step3Title}</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">{o.step3Desc}</p>
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
                          Passive sentinel. Telemetry and alerts recorded to audit.db without firewall
                          mutation.
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
                        <span>{o.step4Title}</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">{o.step4Desc}</p>
                    </div>

                    <div className="p-3 border border-slate-800 bg-slate-950 space-y-1.5 font-mono text-xs">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{o.hmacKeyReady}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Permissions 0600 enforced by runawulf-helper. Anchor: journald stream active.
                      </div>
                    </div>

                    <div className="p-2.5 border border-cyan-500/40 bg-cyan-950/30 text-xs font-mono text-cyan-300">
                      {o.completeNotice}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons Footer */}
              <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentStep === 1}
                  onClick={() =>
                    triggerStepChange(currentStep > 1 ? ((currentStep - 1) as 1 | 2 | 3) : 1)
                  }
                  className="px-3.5 py-1.5 border border-slate-800 bg-slate-950 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{o.btnBack}</span>
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={() =>
                      triggerStepChange(currentStep < 4 ? ((currentStep + 1) as 2 | 3 | 4) : 4)
                    }
                    className="px-4 py-1.5 border border-cyan-500 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                  >
                    <span>{o.btnNext}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAwaken}
                    className="px-5 py-2 border border-cyan-400 bg-cyan-500 text-slate-950 hover:bg-cyan-400 text-xs font-mono font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                  >
                    <span>{o.btnArm}</span>
                    <Zap className="w-4 h-4 fill-slate-950" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
