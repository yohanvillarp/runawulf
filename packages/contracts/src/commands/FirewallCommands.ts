/**
 * @file FirewallCommands.ts
 * @description Strongly-typed commands targeting Algiz and the nftables backend.
 */

import type { SystemCommand } from './SystemCommand.js';

export interface BlockIpPayload {
  readonly ip: string;
  readonly durationSeconds: number;
  readonly reason: string;
}

export type BlockIpCommand = SystemCommand<BlockIpPayload> & {
  readonly type: 'command.firewall.block_ip';
};

export interface UnblockIpPayload {
  readonly ip: string;
}

export type UnblockIpCommand = SystemCommand<UnblockIpPayload> & {
  readonly type: 'command.firewall.unblock_ip';
};

export interface ApplyRulesetPayload {
  readonly candidateRulesetJson: string;
  readonly watchdogTimeoutSeconds?: number;
}

export type ApplyRulesetCommand = SystemCommand<ApplyRulesetPayload> & {
  readonly type: 'command.firewall.apply_ruleset';
};
