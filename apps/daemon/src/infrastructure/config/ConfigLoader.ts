/**
 * @file ConfigLoader.ts
 * @description Loads and validates /etc/runawulf/config.yaml using Zod.
 */

import type { DaemonConfig } from '@runawulf/contracts';

export class ConfigLoader {
  public load(): DaemonConfig {
    throw new Error('Not implemented');
  }
}
