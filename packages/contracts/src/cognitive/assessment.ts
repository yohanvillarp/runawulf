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
      ip: z.string().ip().optional(),
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
