import { z } from 'zod';

export const RingBufferStatsSchema = z.object({
  eventsReceived: z.number().nonnegative(),
  eventsDropped: z.number().nonnegative(),
  bufferFullCount: z.number().nonnegative(),
  consumerLagMs: z.number().nonnegative(),
  timestamp: z.string(),
});

export type RingBufferStats = z.infer<typeof RingBufferStatsSchema>;

export const TelemetryDegradedEventSchema = z.object({
  type: z.literal('TELEMETRY_DEGRADED'),
  reason: z.string(),
  stats: RingBufferStatsSchema,
  timestamp: z.string(),
});

export type TelemetryDegradedEvent = z.infer<typeof TelemetryDegradedEventSchema>;
