/**
 * @file ProcfsReader.ts
 * @description Non-blocking in-memory reader for Linux /proc (stat, meminfo, net/dev, loadavg).
 */

import type { SystemMetricsSnapshot } from '@runawulf/contracts';

export class ProcfsReader {
  public async readMetrics(): Promise<Partial<SystemMetricsSnapshot>> {
    return {};
  }
}
