/**
 * @file metrics/index.ts
 * @description RingBuffer drop metrics and telemetry degradation alarm contracts.
 */

export interface RingBufferHealthMetrics {
  eventsReceived: number;
  eventsDropped: number;
  bufferFullCount: number;
  consumerLagMs: number;
}
