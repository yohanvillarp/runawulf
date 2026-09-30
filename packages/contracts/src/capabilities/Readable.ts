/**
 * @file Readable.ts
 * @description Capability interface for reading point-in-time system state.
 */

/**
 * Interface representing a service or resource capable of inspecting
 * and returning its current state snapshot.
 *
 * @template TState The data model describing the current state.
 */
export interface Readable<TState> {
  /**
   * Retrieves the current snapshot of the resource state.
   *
   * @returns A promise resolving to the current state snapshot.
   */
  getState(): Promise<TState>;
}
