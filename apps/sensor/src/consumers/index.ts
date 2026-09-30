/**
 * @file consumers/index.ts
 * @description RingBuffer consumer interfaces for process executions and socket connections.
 */

export interface RingBufferConsumer<TEvent> {
  start(): Promise<void>;
  stop(): Promise<void>;
  onEvent(handler: (event: TEvent) => void): void;
}
