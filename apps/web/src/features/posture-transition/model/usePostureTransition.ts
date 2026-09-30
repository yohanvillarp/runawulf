/**
 * @file usePostureTransition.ts
 * @description Hook managing posture transition animation stages, shockwaves, and mode commit.
 */

import { useState, useCallback } from 'react';
import type { TransitionPhase } from './types.js';
import type { OperationModeId } from '@/entities/mode';

interface UsePostureTransitionOptions {
  onCommitMode: (modeId: OperationModeId) => void;
}

export function usePostureTransition({ onCommitMode }: UsePostureTransitionOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetModeId, setTargetModeId] = useState<OperationModeId | null>(null);
  const [phase, setPhase] = useState<TransitionPhase>('idle');
  const [isShockwaveActive, setIsShockwaveActive] = useState(false);

  const startTransition = useCallback(
    (newModeId: OperationModeId) => {
      setTargetModeId(newModeId);
      setIsOpen(true);
      setPhase('ipc_verify');
      setIsShockwaveActive(false);

      // Phase 1 -> 2: Reconfigure kernel table
      const timer1 = setTimeout(() => {
        setPhase('kernel_reconfig');
      }, 320);

      // Phase 2 -> 3: Commit mode and fire shockwave
      const timer2 = setTimeout(() => {
        setPhase('posture_commit');
        setIsShockwaveActive(true);
        onCommitMode(newModeId);
      }, 680);

      // Phase 3 -> Finish: Fade out overlay
      const timer3 = setTimeout(() => {
        setIsOpen(false);
        setPhase('completed');
        setIsShockwaveActive(false);
      }, 1050);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    },
    [onCommitMode]
  );

  return {
    isOpen,
    targetModeId,
    phase,
    isShockwaveActive,
    startTransition,
  };
}
