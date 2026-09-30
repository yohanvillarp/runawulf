/**
 * @file daemonConfigSchema.ts
 * @description Zod schema for static daemon configuration loaded from /etc/runawulf/config.yaml.
 */

import { z } from 'zod';

export const DaemonConfigSchema = z.object({
  server: z.object({
    host: z.string().default('0.0.0.0'),
    port: z.number().int().min(1).max(65535).default(4000),
    tls: z.object({
      enabled: z.boolean().default(false),
      certFile: z.string().optional(),
      keyFile: z.string().optional(),
    }).default({ enabled: false }),
  }).default({ host: '0.0.0.0', port: 4000, tls: { enabled: false } }),

  paths: z.object({
    stateDatabase: z.string().default('/var/lib/runawulf/state.db'),
    auditDatabase: z.string().default('/var/lib/runawulf/audit.db'),
    helperSocket: z.string().default('/run/runawulf/helper.sock'),
    staticWebDir: z.string().default('/usr/share/runawulf/web'),
    suricataEveJson: z.string().default('/var/log/suricata/eve.json'),
  }).default({
    stateDatabase: '/var/lib/runawulf/state.db',
    auditDatabase: '/var/lib/runawulf/audit.db',
    helperSocket: '/run/runawulf/helper.sock',
    staticWebDir: '/usr/share/runawulf/web',
    suricataEveJson: '/var/log/suricata/eve.json',
  }),

  logging: z.object({
    level: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  }).default({ level: 'info' }),
});

export type DaemonConfig = z.infer<typeof DaemonConfigSchema>;
