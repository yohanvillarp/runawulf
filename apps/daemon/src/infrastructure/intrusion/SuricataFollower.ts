/**
 * @file SuricataFollower.ts
 * @description Resilient eve.json file follower tracking {device, inode, offset} across logrotate and restarts.
 */

import type { ThreatAlertPayload } from '@runawulf/contracts';

export class SuricataFollower {
  public async *streamAlerts(_signal?: AbortSignal): AsyncIterable<ThreatAlertPayload> {
    // Skeleton generator
  }
}
