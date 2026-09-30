/**
 * @file schemas.ts
 * @description Zod payload schemas for all closed IPC operations.
 */

import { z } from 'zod';

// ==========================================
// Firewall Schemas
// ==========================================

export const AddBlockPayloadSchema = z.object({
  ip: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, { message: 'Must be a valid IPv4 address' }),
  durationSeconds: z.number().int().positive().max(86400 * 30), // Max 30 days
  reason: z.string().min(1).max(256),
});
export type AddBlockPayload = z.infer<typeof AddBlockPayloadSchema>;

export const RemoveBlockPayloadSchema = z.object({
  ip: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/, { message: 'Invalid IP address' }),
});
export type RemoveBlockPayload = z.infer<typeof RemoveBlockPayloadSchema>;

export const PrepareRulesetPayloadSchema = z.object({
  candidateRulesetJson: z.string().min(1).max(512 * 1024), // Max 512KB
  watchdogTimeoutSeconds: z.number().int().min(10).max(120).default(30),
});
export type PrepareRulesetPayload = z.infer<typeof PrepareRulesetPayloadSchema>;

export const CommitRulesetPayloadSchema = z.object({
  transactionId: z.string().uuid(),
});
export type CommitRulesetPayload = z.infer<typeof CommitRulesetPayloadSchema>;

// ==========================================
// Systemd Schemas
// ==========================================

export const ServiceActionPayloadSchema = z.object({
  unitName: z.string().regex(/^[a-zA-Z0-9_\-@]+\.(service|socket|target)$/),
});
export type ServiceActionPayload = z.infer<typeof ServiceActionPayloadSchema>;

// ==========================================
// Audit Schemas
// ==========================================

export const AuditSignPayloadSchema = z.object({
  canonicalPayload: z.string(),
  prevEntryHmac: z.string().length(64), // SHA-256 hex string
});
export type AuditSignPayload = z.infer<typeof AuditSignPayloadSchema>;

export const AuditAnchorPayloadSchema = z.object({
  batchLastHmac: z.string().length(64),
  totalEntries: z.number().int().nonnegative(),
});
export type AuditAnchorPayload = z.infer<typeof AuditAnchorPayloadSchema>;
