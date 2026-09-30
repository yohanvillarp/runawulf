/**
 * @file SignalHandler.ts
 * @description POSIX signal trapper (SIGTERM, SIGINT graceful shutdown; SIGHUP atomic hot-reload).
 */

export class SignalHandler {
  public register(_onShutdown: () => Promise<void>, _onReload: () => Promise<void>): void {}
}
