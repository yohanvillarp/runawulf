/**
 * @file PolicyLoader.ts
 * @description Reads and parses the root-owned privileged-policy.yaml.
 */

import fs from 'node:fs';
import YAML from 'yaml';
import { HelperPolicySchema, type HelperPolicy } from '@runawulf/contracts';

export class PolicyLoader {
  private activePolicy: HelperPolicy | null = null;

  constructor(private readonly policyPath: string = '/etc/runawulf/privileged-policy.yaml') {}

  /**
   * Loads and validates the policy file.
   * Throws if the file is invalid or missing.
   */
  public load(): HelperPolicy {
    if (!fs.existsSync(this.policyPath)) {
      throw new Error(`Privileged policy file not found at ${this.policyPath}`);
    }

    const content = fs.readFileSync(this.policyPath, 'utf-8');
    const parsedYaml = YAML.parse(content);
    this.activePolicy = HelperPolicySchema.parse(parsedYaml);
    return this.activePolicy;
  }

  public getPolicy(): HelperPolicy {
    if (!this.activePolicy) {
      return this.load();
    }
    return this.activePolicy;
  }
}
