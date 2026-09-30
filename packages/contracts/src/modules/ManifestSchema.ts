/**
 * @file ManifestSchema.ts
 * @description Zod schema for validating declarative module manifests (.rwmod.yaml)
 * with strict SSRF guardrails and no raw shell execution.
 */

import { z } from 'zod';

const FORBIDDEN_METADATA_HOSTS = ['169.254.169.254', 'metadata.google.internal', 'instance-data'];

export const HttpHealthCheckSchema = z.object({
  type: z.literal('http'),
  endpoint: z.string().url().refine((url) => {
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) return false;
      if (FORBIDDEN_METADATA_HOSTS.includes(parsed.hostname)) return false;
      return true;
    } catch {
      return false;
    }
  }, { message: 'Invalid or restricted health-check URL' }),
  intervalSeconds: z.number().int().min(5).max(3600).default(15),
  expectedStatus: z.number().int().min(100).max(599).default(200),
  metricExtraction: z.record(z.object({
    jsonPath: z.string().min(1).regex(/^\$[a-zA-Z0-9_.\[\]*]+$/),
  })).optional(),
});

export const SystemdUnitResourceSchema = z.object({
  name: z.string().regex(/^[a-zA-Z0-9_\-@]+\.(service|socket|target)$/),
  permittedActions: z.array(z.enum(['status', 'reload', 'restart', 'stop', 'start'])).min(1),
});

export const DeclarativeModuleManifestSchema = z.object({
  apiVersion: z.literal('runawulf.io/v1alpha1'),
  kind: z.literal('DeclarativeModule'),
  metadata: z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string().min(1).max(64),
    version: z.string().regex(/^\d+\.\d+\.\d+$/),
    description: z.string().max(256).optional(),
  }),
  resources: z.object({
    systemdUnits: z.array(SystemdUnitResourceSchema).optional(),
    healthChecks: z.array(HttpHealthCheckSchema).optional(),
  }),
  requiredPermissions: z.array(z.string().min(1)),
});

export type DeclarativeModuleManifest = z.infer<typeof DeclarativeModuleManifestSchema>;
