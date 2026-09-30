/**
 * @file OnboardingPage.tsx
 * @description The Runic Awakening: 2-column cockpit layout for initial setup & host verification
 * with a cinematic full-screen awakening sequence transitioning smoothly into the main control plane.
 */

import { useState } from 'react';
import { useTranslation } from '@/app/providers/LanguageProvider';
import { useOperationMode } from '@/app/providers/ModeProvider';
import { LanguageSwitcher } from '@/features/language-switcher';
import { ArrowRight, ArrowLeft, Zap } from 'lucide-react';
import type { OperationModeId } from '@/entities/mode';
import { OnboardingAwakeningOverlay } from './ui/OnboardingAwakeningOverlay';
import { OnboardingSentinelPanel } from './ui/OnboardingSentinelPanel';
import { OnboardingStepContent } from './ui/OnboardingStepContent';

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

    setTimeout(() => {
      setAwakeningStage(2);
      setShockwave(true);
    }, 700);

    setTimeout(() => {
      setAwakeningStage(3);
      setShockwave(true);
    }, 1400);

    setTimeout(() => {
      setIsFadingOut(true);
    }, 2100);

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
    { num: 1 as const, rune: 'ᛉ', color: '#06b6d4', label: o.step1Title },
    { num: 2 as const, rune: 'ᛇ', color: '#f59e0b', label: o.step2Title },
    { num: 3 as const, rune: 'ᛟ', color: '#06b6d4', label: o.step3Title },
    { num: 4 as const, rune: 'ᚱ', color: '#10b981', label: o.step4Title },
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
        <OnboardingAwakeningOverlay
          awakeningStage={awakeningStage}
          selectedInterface={selectedInterface}
          glowSurge={glowSurge}
          shockwave={shockwave}
        />
      ) : (
        /* STANDARD 2-COLUMN COCKPIT LAYOUT */
        <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
            {/* LEFT COLUMN: Runic Wolf Sentinel & Live Telemetry Meter (5 cols) */}
            <OnboardingSentinelPanel
              currentStep={currentStep}
              activeStepMeta={activeStepMeta}
              glowSurge={glowSurge}
              shockwave={shockwave}
            />

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
              <OnboardingStepContent
                currentStep={currentStep}
                selectedInterface={selectedInterface}
                setSelectedInterface={setSelectedInterface}
                evePath={evePath}
                setEvePath={setEvePath}
                initialPosture={initialPosture}
                setInitialPosture={setInitialPosture}
                t={o}
              />

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
