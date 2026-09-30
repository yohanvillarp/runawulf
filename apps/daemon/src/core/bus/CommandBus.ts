/**
 * @file CommandBus.ts
 * @description Unified pipeline for authorizing and routing mutation commands to IPC helper.
 */

import type { SystemCommand, ActionResult } from '@runawulf/contracts';

export class CommandBus {
  public async dispatch<TResult = ActionResult>(_command: SystemCommand): Promise<TResult> {
    throw new Error('Not implemented');
  }
}
