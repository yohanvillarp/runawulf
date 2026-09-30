/**
 * @file AuditEntry.ts
 * @description Domain model and Zod schema for cryptographic tamper-evident audit log entries.
 */

import { z } from 'zod';

export const AuditEntrySchema = z.object({
  id: z.number().int().positive().optional(), // Auto-incremented in SQLite
  timestamp: z.string().datetime(),
  actorType: z.enum(['USER_SESSION', 'POLICY_AUTOMATION', 'SYSTEM', 'CLI']),
  actorId: z.string().min(1),
  actionType: z.string().min(1),
  targetResource: z.string().min(1),
  payloadJson: z.string(),
  status: z.enum(['SUCCESS', 'REJECTED', 'ERROR']),
  executionDurationMs: z.number().int().nonnegative(),
  clientIp: z.string().optional(),
  prevEntryHmac: z.string().length(64),
  entryHmac: z.string().length(64),
});

export type AuditEntry = z.infer<typeof AuditEntrySchema>;
