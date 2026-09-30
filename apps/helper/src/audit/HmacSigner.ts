/**
 * @file HmacSigner.ts
 * @description Generates HMAC-SHA256 signatures for tamper-evident audit log entries
 * using a root-protected key inaccessible to the unprivileged daemon.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';

export class HmacSigner {
  private secretKey: Buffer | null = null;

  constructor(private readonly keyPath: string = '/etc/runawulf/audit.key') {}

  private getKey(): Buffer {
    if (!this.secretKey) {
      if (!fs.existsSync(this.keyPath)) {
        throw new Error(`Audit key not found at ${this.keyPath}`);
      }
      this.secretKey = fs.readFileSync(this.keyPath);
    }
    return this.secretKey;
  }

  /**
   * Generates HMAC-SHA256 hash over canonical payload and previous hash.
   */
  public signEntry(canonicalPayload: string, prevEntryHmac: string): string {
    const key = this.getKey();
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(prevEntryHmac);
    hmac.update(canonicalPayload);
    return hmac.digest('hex');
  }
}
