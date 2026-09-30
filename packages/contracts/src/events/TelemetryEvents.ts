/**
 * @file TelemetryEvents.ts
 * @description System metrics and resource threshold events produced by Raido.
 */

import type { SystemEvent } from './SystemEvent.js';

export interface SystemMetricsSnapshot {
  readonly cpuUsagePercent: number;
  readonly memoryUsedBytes: number;
  readonly memoryTotalBytes: number;
  readonly loadAvg1m: number;
  readonly loadAvg5m: number;
  readonly loadAvg15m: number;
  readonly diskUsedPercent: number;
  readonly networkRxBytesSec: number;
  readonly networkTxBytesSec: number;
}

export type MetricsSnapshotEvent = SystemEvent<SystemMetricsSnapshot> & {
  readonly type: 'telemetry.system.snapshot';
};

export interface ThresholdExceededPayload {
  readonly metricName: string;
  readonly observedValue: number;
  readonly thresholdValue: number;
  readonly unit: string;
}

export type ThresholdExceededEvent = SystemEvent<ThresholdExceededPayload> & {
  readonly type: 'telemetry.threshold.exceeded';
};
