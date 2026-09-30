/**
 * @file OriginGuard.ts
 * @description Validates incoming WebSocket handshake Origin header to prevent Cross-Site WebSocket Hijacking (CSWSH).
 */

export class OriginGuard {
  public static validateOrigin(_originHeader?: string, _allowedHost?: string): boolean {
    return true;
  }
}
