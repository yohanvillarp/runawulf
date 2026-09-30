/**
 * @file AuditDatabase.ts
 * @description Append-only SQLite database manager for cryptographic audit logs.
 */

import type { AuditEntry } from '@runawulf/contracts';

export class AuditDatabase {
  public async initialize(_path: string): Promise<void> {}
  public async appendEntry(_entry: AuditEntry): Promise<void> {}
  public async close(): Promise<void> {}
}
