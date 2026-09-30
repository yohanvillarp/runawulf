import { z } from 'zod';

export const MitigationRecommendationSchema = z.object({
  action: z.enum([
    'NOOP',
    'RECOMMEND_QUARANTINE_IP',
    'RECOMMEND_RATE_LIMIT_PORT',
    'RECOMMEND_PROCESS_ISOLATION',
    'REQUEST_OPERATOR_REVIEW',
  ]),
  target: z
    .object({
      ip: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/, { message: 'Invalid IP address' }).optional(),
      port: z.number().int().min(1).max(65535).optional(),
      pid: z.number().int().positive().optional(),
      processIdentity: z.string().optional(),
    })
    .optional(),
  confidence: z.number().min(0).max(1),
  explanation: z.string(),
  threatClassification: z.string(),
  indicatorsOfCompromise: z.array(z.string()),
});

export type MitigationRecommendation = z.infer<typeof MitigationRecommendationSchema>;

export const IncidentAssessmentSchema = z.object({
  incidentId: z.string(),
  analyzedAt: z.string(),
  providerId: z.string(),
  threatSummary: z.string(),
  recommendations: z.array(MitigationRecommendationSchema),
});

export type IncidentAssessment = z.infer<typeof IncidentAssessmentSchema>;
