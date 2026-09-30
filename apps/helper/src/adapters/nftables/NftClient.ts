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
   * Executes an nft command passing data to stdin.
   */
  public async executeWithInput(args: string[], input: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = execFile(
        this.nftBinary,
        args,
        { timeout: 5000, maxBuffer: 512 * 1024 },
        (error, stdout, stderr) => {
          if (error) {
            reject(new Error(stderr || error.message));
          } else {
            resolve(stdout);
          }
        }
      );

      if (child.stdin) {
        child.stdin.write(input);
        child.stdin.end();
      } else {
        reject(new Error('Failed to open child process stdin'));
      }
    });
  }

  /**
   * Validates a candidate ruleset JSON syntax without applying changes (--check).
   */
  public async checkSyntax(rulesetJson: string): Promise<boolean> {
    try {
      await this.executeWithInput(['-c', '-j'], rulesetJson);
      return true;
    } catch {
      return false;
    }
  }
}
