/**
 * @file WatchdogRollback.ts
 * @description Autonomous 30-second rollback watchdog for atomic nftables mutations (Invariant I5).
 * Resides strictly within root space in runawulf-helper.
 */

import type { NftClient } from './NftClient.js';

interface PendingTransaction {
  transactionId: string;
  backupRuleset: string;
  timer: NodeJS.Timeout;
}

export class WatchdogRollback {
  private activeTransaction: PendingTransaction | null = null;

  constructor(private readonly nftClient: NftClient) {}

  /**
   * Prepares and applies a candidate ruleset while starting the autonomous watchdog timer.
   */
  public async prepareAndApply(
    transactionId: string,
    candidateRulesetJson: string,
    timeoutSeconds: number = 30
  ): Promise<void> {
    if (this.activeTransaction) {
      throw new Error('Another firewall transaction is already pending confirmation');
    }

    // 1. Take a snapshot of the current table inet runawulf
    const currentRuleset = await this.nftClient.execute(['list', 'table', 'inet', 'runawulf']);

    // 2. Start autonomous rollback timer
    const timer = setTimeout(async () => {
      console.warn(`[Watchdog] Timeout reached for transaction ${transactionId}. Rolling back ruleset...`);
      await this.rollback(transactionId);
    }, timeoutSeconds * 1000);

    this.activeTransaction = {
      transactionId,
      backupRuleset: currentRuleset,
      timer,
    };

    // 3. Apply candidate ruleset safely via stdin
    await this.nftClient.executeWithInput(['-f', '-'], candidateRulesetJson);
  }

  /**
   * Confirms the candidate ruleset and cancels the autonomous watchdog.
   */
  public async commit(transactionId: string): Promise<void> {
    if (!this.activeTransaction || this.activeTransaction.transactionId !== transactionId) {
      throw new Error(`Transaction ${transactionId} not found or expired`);
    }

    clearTimeout(this.activeTransaction.timer);
    this.activeTransaction = null;
  }

  /**
   * Reverts changes using the saved snapshot.
   */
  public async rollback(transactionId: string): Promise<void> {
    if (!this.activeTransaction || this.activeTransaction.transactionId !== transactionId) {
      return;
    }

    clearTimeout(this.activeTransaction.timer);
    const backup = this.activeTransaction.backupRuleset;
    this.activeTransaction = null;

    // Restore backup snapshot safely via stdin
    await this.nftClient.executeWithInput(['-f', '-'], backup);
  }
}
