/**
 * @file context/index.ts
 * @description Context builder exports for sanitization and prompt injection mitigation.
 */

export interface ContextBuilderConfig {
  maxEvents: number;
  timeWindowSeconds: number;
  redactSensitives: boolean;
}

export const DEFAULT_CONTEXT_CONFIG: ContextBuilderConfig = {
  maxEvents: 50,
  timeWindowSeconds: 300,
  redactSensitives: true,
};
