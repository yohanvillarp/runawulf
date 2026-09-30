/**
 * @file NftClient.ts
 * @description Safe executor for nftables commands, strictly scoped to `table inet runawulf`.
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export class NftClient {
  private readonly nftBinary = '/usr/sbin/nft';

  /**
   * Executes an nft command safely with argument arrays (no shell interpretation).
   */
  public async execute(args: string[]): Promise<string> {
    const { stdout } = await execFileAsync(this.nftBinary, args, {
      timeout: 5000,
      maxBuffer: 512 * 1024,
    });
    return stdout;
  }

  /**
   * Validates a candidate ruleset JSON syntax without applying changes (--check).
   */
  public async checkSyntax(rulesetJson: string): Promise<boolean> {
    try {
      await execFileAsync(this.nftBinary, ['-c', '-j'], {
        input: rulesetJson,
        timeout: 5000,
      });
      return true;
    } catch {
      return false;
    }
  }
}
