/**
 * @file SecurityEvents.ts
 * @description Domain events emitted by intrusion detection, network protection, and authentication.
 */

import type { SystemEvent } from './SystemEvent.js';

export interface ThreatAlertPayload {
  readonly alertId: number;
  readonly signature: string;
  readonly category: string;
  readonly severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  readonly sourceIp: string;
  readonly sourcePort?: number;
  readonly destinationIp: string;
  readonly destinationPort?: number;
  readonly protocol?: string;
  readonly rawJson?: string;
}

export type SecurityThreatDetectedEvent = SystemEvent<ThreatAlertPayload> & {
  readonly type: 'security.threat.detected';
};

export interface IpBlockedPayload {
  readonly ip: string;
  readonly durationSeconds: number;
  readonly reason: string;
  readonly policyId?: string;
}

export type IpBlockedEvent = SystemEvent<IpBlockedPayload> & {
  readonly type: 'security.firewall.ip_blocked';
};

export interface IpUnblockedPayload {
  readonly ip: string;
  readonly unblockedBy: string;
}

export type IpUnblockedEvent = SystemEvent<IpUnblockedPayload> & {
  readonly type: 'security.firewall.ip_unblocked';
};
