/**
 * @file SystemCommand.ts
 * @description Base interface framing actionable mutation commands submitted through the Command Bus.
 */

import type { ExecutionContext } from '../capabilities/Actionable.js';

export interface SystemCommand<TPayload = unknown> {
  /** Unique command identifier (UUIDv4) */
  readonly commandId: string;
  /** Categorized command action name (e.g., 'command.firewall.block_ip') */
  readonly type: string;
  /** Context carrying actor identity, role, and client IP */
  readonly context: ExecutionContext;
  /** Command parameter payload */
  readonly payload: TPayload;
}
