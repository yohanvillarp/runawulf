/**
 * @file Observable.ts
 * @description Capability interface for continuous telemetry and event stream subscriptions.
 */

/**
 * Interface representing a service or resource capable of producing
 * an asynchronous continuous stream of telemetry items or domain events.
 *
 * @template TTelemetry The data type emitted in the stream.
 */
export interface Observable<TTelemetry> {
  /**
   * Subscribes to the continuous stream of telemetry or events.
   *
   * @param signal Optional AbortSignal to cancel the subscription loop.
   * @returns An AsyncIterable emitting telemetry updates.
   */
  subscribe(signal?: AbortSignal): AsyncIterable<TTelemetry>;
}
