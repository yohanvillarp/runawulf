/**
 * @file Configurable.ts
 * @description Capability interface for reading and mutating service configuration state.
 */

import type { ExecutionContext } from './Actionable.js';

/**
 * Interface representing a service or resource with configurable settings.
 *
 * @template TConfig The strongly-typed configuration schema.
 */
export interface Configurable<TConfig> {
  /**
   * Reads the active configuration object.
   *
   * @returns A promise resolving to the active configuration.
   */
  getConfig(): Promise<TConfig>;

  /**
   * Applies an updated configuration object to the resource.
   *
   * @param config The candidate configuration to apply.
   * @param ctx Execution provenance and security context.
   * @returns A promise resolving when configuration is applied.
   */
  applyConfig(config: TConfig, ctx: ExecutionContext): Promise<void>;
}
