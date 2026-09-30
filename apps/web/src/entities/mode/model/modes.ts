/**
 * @file modes.ts
 * @description Operational modes specifications with mapped posture identities.
 */

import type { OperationMode } from './types.js';

export const OPERATION_MODES: OperationMode[] = [
  {
    id: 'guardian',
    rune: 'ᛉ',
    runeName: 'Algiz',
    statusBadge: 'AUTONOMOUS',
    autoEnforcement: true,
    accentColor: '#06b6d4',
    themeName: 'Arctic Frost',
  },
  {
    id: 'watcher',
    rune: 'ᛟ',
    runeName: 'Othala',
    statusBadge: 'AUDIT_ONLY',
    autoEnforcement: false,
    accentColor: '#f59e0b',
    themeName: 'Odin Amber',
  },
  {
    id: 'lockdown',
    rune: 'ᛏ',
    runeName: 'Tiwaz',
    statusBadge: 'CONTAINMENT',
    autoEnforcement: true,
    accentColor: '#ef4444',
    themeName: 'Fenrir Crimson',
  },
];
