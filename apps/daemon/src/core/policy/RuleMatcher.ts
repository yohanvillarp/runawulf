/**
 * @file RuleMatcher.ts
 * @description Matches domain events against configured rule predicates.
 */

export class RuleMatcher {
  public matches(_predicate: unknown, _event: unknown): boolean {
    return false;
  }
}
