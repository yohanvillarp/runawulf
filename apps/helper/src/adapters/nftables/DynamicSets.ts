/**
 * @file DynamicSets.ts
 * @description Manages O(1) dynamic timeout sets inside `table inet runawulf`.
 */

import type { NftClient } from './NftClient.js';

export class DynamicSetsManager {
  constructor(private readonly nftClient: NftClient) {}

  /**
   * Adds an IP to the dynamic blocked set with kernel-managed timeout.
   *
   * @param ip Target IPv4 or IPv6 address.
   * @param durationSeconds Expiration duration managed in kernel space.
   */
  public async addBlock(ip: string, durationSeconds: number): Promise<void> {
    const setName = ip.includes(':') ? 'blocked_ipv6' : 'blocked_ipv4';
    const command = [
      'add', 'element', 'inet', 'runawulf', setName,
      `{ ${ip} timeout ${durationSeconds}s }`
    ];

    await this.nftClient.execute(command);
  }

  /**
   * Manually removes an IP from the blocked set before its timeout expires.
   */
  public async removeBlock(ip: string): Promise<void> {
    const setName = ip.includes(':') ? 'blocked_ipv6' : 'blocked_ipv4';
    const command = [
      'delete', 'element', 'inet', 'runawulf', setName,
      `{ ${ip} }`
    ];

    await this.nftClient.execute(command);
  }
}
