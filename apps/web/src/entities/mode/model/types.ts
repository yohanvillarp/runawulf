/**
 * @file types.ts
 * @description Domain models for Runawulf operational postures and posture-driven theming.
 */

export type OperationModeId = 'guardian' | 'watcher' | 'lockdown';

export interface OperationMode {
  id: OperationModeId;
  rune: string;
  runeName: string;
  statusBadge: string;
  autoEnforcement: boolean;
  accentColor: string;
  themeName: string;
}
