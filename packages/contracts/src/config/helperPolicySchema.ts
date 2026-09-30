/**
 * @file helperPolicySchema.ts
 * @description Zod schema for privileged-policy.yaml owned by root:root (0644).
 * Enforces helper-side unyielding invariants regardless of what the unprivileged daemon requests.
 */

import { z } from 'zod';

export const HelperPolicySchema = z.object({
  version: z.literal('2.0'),

  systemd: z.object({
    allowedUnits: z.array(z.string().regex(/^[a-zA-Z0-9_\-@]+\.(service|socket|target)$/)).default([]),
  }).default({ allowedUnits: [] }),

  firewall: z.object({
    managedTable: z.literal('table inet runawulf').default('table inet runawulf'),
    maxDynamicBlockDurationSeconds: z.number().int().max(86400 * 30).default(86400 * 7),
    protectedCidrs: z.array(z.string().regex(/^([0-9]{1,3}\.){3}[0-9]{1,3}\/([0-9]|[1-2][0-9]|3[0-2])$/, { message: 'Must be a valid IPv4 CIDR' })).default(['127.0.0.1/32']),
    protectedPorts: z.array(z.number().int().min(1).max(65535)).default([22, 4000]),
  }).default({
    managedTable: 'table inet runawulf',
    maxDynamicBlockDurationSeconds: 86400 * 7,
    protectedCidrs: ['127.0.0.1/32'],
    protectedPorts: [22, 4000],
  }),

  audit: z.object({
    keyPath: z.string().default('/etc/runawulf/audit.key'),
    anchorIntervalEvents: z.number().int().positive().default(100),
  }).default({
    keyPath: '/etc/runawulf/audit.key',
    anchorIntervalEvents: 100,
  }),
});

export type HelperPolicy = z.infer<typeof HelperPolicySchema>;
