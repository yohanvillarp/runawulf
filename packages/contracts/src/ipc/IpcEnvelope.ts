/**
 * @file IpcEnvelope.ts
 * @description Standard framing envelopes for Unix Domain Socket IPC communication between daemon and helper.
 */

import { z } from 'zod';

export const IPC_PROTOCOL_VERSION = '2.0' as const;
export const MAX_IPC_MESSAGE_BYTES = 64 * 1024; // 64 KB strictly enforced maximum

/**
 * Envelope schema framing incoming requests sent by the unprivileged daemon to the privileged helper.
 */
export const IpcRequestEnvelopeSchema = z.object({
  protocolVersion: z.literal(IPC_PROTOCOL_VERSION),
  requestId: z.string().uuid(),
  operation: z.string().min(1).max(64),
  payload: z.record(z.unknown()),
  deadlineMs: z.number().int().positive().max(60000).default(5000),
});

export type IpcRequestEnvelope = z.infer<typeof IpcRequestEnvelopeSchema>;

/**
 * Envelope schema framing responses returned by the privileged helper.
 */
export const IpcResponseEnvelopeSchema = z.object({
  protocolVersion: z.literal(IPC_PROTOCOL_VERSION),
  requestId: z.string().uuid(),
  success: z.boolean(),
  error: z.string().optional(),
  data: z.unknown().optional(),
  executionDurationMs: z.number().nonnegative(),
});

export type IpcResponseEnvelope = z.infer<typeof IpcResponseEnvelopeSchema>;
