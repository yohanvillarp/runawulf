/**
 * @file DashboardPage.tsx
 * @description Dynamic operational dashboard that mutates layout, density, and tooling
 * based on the active operational posture:
 * - Guardian: Tactical Command Center
 * - Watcher: Telemetry & Forensics Observatory
 * - Lockdown: Emergency Containment Deck
 */

import { useOperationMode } from '@/app/providers/ModeProvider';
import { GuardianView } from './views/GuardianView.js';
import { WatcherView } from './views/WatcherView.js';
import { LockdownView } from './views/LockdownView.js';

export function DashboardPage() {
  const { operationMode } = useOperationMode();

  return (
    <div className="w-full pb-10">
      {operationMode.id === 'guardian' && <GuardianView />}
      {operationMode.id === 'watcher' && <WatcherView />}
      {operationMode.id === 'lockdown' && <LockdownView />}
    </div>
  );
}
