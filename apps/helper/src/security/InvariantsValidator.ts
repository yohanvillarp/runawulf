/**
 * @file InvariantsValidator.ts
 * @description Validates incoming requests against hard root-owned policy invariants.
 * Enforces that the helper never blindly trusts the daemon.
 */

import type { HelperPolicy } from '@runawulf/contracts';

export class InvariantsValidator {
  constructor(private readonly policy: HelperPolicy) {}

  /**
   * Validates whether a systemd unit is permitted to be restarted or controlled.
   */
  public isUnitAllowed(unitName: string): boolean {
    return this.policy.systemd.allowedUnits.includes(unitName);
  }

  /**
   * Validates whether an IP address is protected and must NEVER be blocked.
   */
  public isProtectedIp(ip: string): boolean {
    // Check against protected CIDRs in the root policy
    return this.policy.firewall.protectedCidrs.some(cidr => cidr.startsWith(ip));
  }

  /**
   * Validates that requested block duration does not exceed the root-configured maximum.
   */
  public validateDuration(seconds: number): number {
    return Math.min(seconds, this.policy.firewall.maxDynamicBlockDurationSeconds);
  }
}
