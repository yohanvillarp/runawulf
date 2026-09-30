/**
 * @file Actionable.ts
 * @description Capability interface for executing discrete mutating operations.
 */

/**
 * Context passed along during action execution, carrying provenance and security identity.
 */
export interface ExecutionContext {
  /** Identifier of the actor initiating the action (user ID, policy ID, or 'system') */
  readonly actorId: string;
  /** Actor classification: user session, automated policy, or internal core engine */
  readonly actorType: 'USER_SESSION' | 'POLICY_AUTOMATION' | 'SYSTEM';
  /** Correlation ID for tracing across daemon and helper logs */
  readonly correlationId: string;
  /** Timestamp when the execution was requested */
  readonly timestamp: Date;
  /** Optional client IP address if triggered via web interface */
  readonly clientIp?: string;
}

/**
 * Standard outcome model returned by Actionable executions.
 */
export interface ActionResult<TData = unknown> {
  /** Execution status flag */
  readonly success: boolean;
  /** Human-readable status or error message */
  readonly message: string;
  /** Execution latency in milliseconds */
  readonly durationMs: number;
  /** Optional structured return data */
  readonly data?: TData;
}

/**
 * Interface representing a service or resource that can execute discrete actions.
 *
 * @template TAction The strongly-typed action intent data model.
 * @template TResult The result type returned after execution, defaulting to ActionResult.
 */
export interface Actionable<TAction, TResult = ActionResult> {
  /**
   * Executes a validated domain action against the underlying resource.
   *
   * @param action The domain action parameters.
   * @param ctx Execution provenance and security context.
   * @returns A promise resolving to the action result.
   */
  execute(action: TAction, ctx: ExecutionContext): Promise<TResult>;
}
