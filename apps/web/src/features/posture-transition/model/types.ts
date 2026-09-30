/**
 * @file types.ts
 * @description Types for the Posture Transition Overlay and Runic Wolf loader.
 */

import type { OperationModeId } from '@/entities/mode';

export type TransitionPhase =
  | 'idle'
  | 'ipc_verify'
  | 'kernel_reconfig'
  | 'posture_commit'
  | 'completed';

export interface TransitionState {
  isActive: boolean;
  targetModeId: OperationModeId | null;
  phase: TransitionPhase;
  stepMessage: string;
}
