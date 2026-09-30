/**
 * @file EventBus.ts
 * @description In-memory reactive publisher/subscriber for immutable domain events.
 */

import type { SystemEvent } from '@runawulf/contracts';

export type EventHandler<T extends SystemEvent = SystemEvent> = (event: T) => Promise<void> | void;

export class EventBus {
  public subscribe<T extends SystemEvent>(_eventType: string, _handler: EventHandler<T>): void {}
  public async publish<T extends SystemEvent>(_event: T): Promise<void> {}
}
