/**
 * @file ModeProvider.tsx
 * @description Context provider managing system operational posture, posture-driven theming, and animated transitions.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  OPERATION_MODES,
  type OperationMode,
  type OperationModeId,
} from '@/entities/mode';
import {
  PostureTransitionOverlay,
  usePostureTransition,
} from '@/features/posture-transition';

interface ModeContextValue {
  operationMode: OperationMode;
  setOperationModeId: (id: OperationModeId) => void;
  availableOperationModes: OperationMode[];
  isTransitioning: boolean;
}

const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [operationModeId, setOperationModeIdState] = useState<OperationModeId>(() => {
    try {
      const saved = localStorage.getItem('runawulf_operation_mode') as OperationModeId;
      if (saved && (saved === 'guardian' || saved === 'watcher' || saved === 'lockdown')) {
        return saved;
      }
    } catch {
      // Ignore
    }
    return 'guardian';
  });

  const commitModeChange = useCallback((id: OperationModeId) => {
    setOperationModeIdState(id);
    try {
      localStorage.setItem('runawulf_operation_mode', id);
    } catch {
      // Ignore
    }
  }, []);

  const {
    isOpen,
    targetModeId,
    phase,
    isShockwaveActive,
    startTransition,
  } = usePostureTransition({
    onCommitMode: commitModeChange,
  });

  const setOperationModeId = useCallback(
    (id: OperationModeId) => {
      if (id === operationModeId) return;
      startTransition(id);
    },
    [operationModeId, startTransition]
  );

  const operationMode =
    OPERATION_MODES.find((m) => m.id === operationModeId) ?? OPERATION_MODES[0];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', operationMode.id);
    document.documentElement.setAttribute('data-operation-mode', operationMode.id);
  }, [operationMode]);

  return (
    <ModeContext.Provider
      value={{
        operationMode,
        setOperationModeId,
        availableOperationModes: OPERATION_MODES,
        isTransitioning: isOpen,
      }}
    >
      {children}

      {/* Runic Wolf Posture Transition Overlay */}
      <PostureTransitionOverlay
        isOpen={isOpen}
        targetModeId={targetModeId}
        phase={phase}
        isShockwaveActive={isShockwaveActive}
      />
    </ModeContext.Provider>
  );
}

export function useOperationMode(): ModeContextValue {
  const ctx = useContext(ModeContext);
  if (!ctx) {
    throw new Error('useOperationMode must be used within a ModeProvider');
  }
  return ctx;
}
