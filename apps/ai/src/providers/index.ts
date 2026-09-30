/**
 * @file providers/index.ts
 * @description Cognitive providers registry exports (OpenAI, Anthropic, Gemini, Ollama, Mozaik).
 */

export const AVAILABLE_PROVIDERS = [
  'openai',
  'anthropic',
  'gemini',
  'ollama',
  'vllm',
  'mozaik',
] as const;

export type SupportedProviderType = (typeof AVAILABLE_PROVIDERS)[number];
