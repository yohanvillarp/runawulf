import { z } from 'zod';

export const NormalizedAlertSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  source: z.string(),
  severity: z.number().int().min(1).max(5),
  signature: z.string(),
  srcIp: z.string(),
  destIp: z.string(),
  rawCategory: z.string().optional(),
});

export type NormalizedAlert = z.infer<typeof NormalizedAlertSchema>;

export const IncidentContextSchema = z.object({
  incidentId: z.string(),
  timeWindow: z.object({
    start: z.string(),
    end: z.string(),
  }),
  alerts: z.array(NormalizedAlertSchema),
  systemSummary: z.object({
    posture: z.enum(['GUARDIAN', 'WATCHER', 'LOCKDOWN']),
    cpuLoad: z.number(),
    activeConnections: z.number(),
  }),
  networkSummary: z.object({
    topTalkers: z.array(
      z.object({
        ip: z.string(),
        packets: z.number(),
        bytes: z.number(),
      })
    ),
    dropRate: z.number(),
  }),
});

export type IncidentContext = z.infer<typeof IncidentContextSchema>;
