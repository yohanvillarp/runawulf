/**
 * @file SystemdClient.ts
 * @description Controls authorized systemd units via systemctl or D-Bus.
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { InvariantsValidator } from '../../security/InvariantsValidator.js';

const execFileAsync = promisify(execFile);

export class SystemdClient {
  private readonly systemctlBinary = '/usr/bin/systemctl';

  constructor(private readonly validator: InvariantsValidator) {}

  /**
   * Restarts an authorized systemd unit.
   */
  public async restartUnit(unitName: string): Promise<void> {
    if (!this.validator.isUnitAllowed(unitName)) {
      throw new Error(`Unit ${unitName} is not permitted by root policy`);
    }

    await execFileAsync(this.systemctlBinary, ['restart', unitName], { timeout: 15000 });
  }

  /**
   * Retrieves status for an authorized systemd unit.
   */
  public async getUnitStatus(unitName: string): Promise<string> {
    if (!this.validator.isUnitAllowed(unitName)) {
      throw new Error(`Unit ${unitName} is not permitted by root policy`);
    }

    const { stdout } = await execFileAsync(this.systemctlBinary, ['is-active', unitName]);
    return stdout.trim();
  }
}
