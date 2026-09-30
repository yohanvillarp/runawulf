/**
 * @file runtime/index.ts
 * @description Cognitive Runtime orchestrator skeleton.
 */

export interface CognitiveRuntimeState {
  isReady: boolean;
  activeProviderId: string | null;
  lastAnalysisTimestamp: string | null;
}
