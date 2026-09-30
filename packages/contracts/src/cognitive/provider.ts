import type { IncidentAssessment } from './assessment.js';
import type { IncidentContext } from './context.js';

export interface CognitiveProviderCapabilities {
  structuredOutput: boolean;
  streaming: boolean;
  offlineLocal: boolean;
}

export interface CognitiveProvider {
  readonly id: string;
  readonly type: 'openai' | 'anthropic' | 'gemini' | 'ollama' | 'vllm' | 'mozaik';
  readonly capabilities: CognitiveProviderCapabilities;

  analyzeIncident(
    context: IncidentContext,
    signal?: AbortSignal
  ): Promise<IncidentAssessment>;
}
