/**
 * @file SystemEvent.ts
 * @description Base definition for immutable system domain events.
 */

export interface SystemEvent<TPayload = unknown> {
  /** Unique event identifier (UUIDv4) */
  readonly id: string;
  /** Categorized event type name */
  readonly type: string;
  /** ISO timestamp when the event occurred in the system */
  readonly timestamp: string;
  /** Source component producing the event (e.g., 'eiwaz.suricata', 'raido.metrics') */
  readonly source: string;
  /** Structured, immutable event data */
  readonly payload: TPayload;
}
