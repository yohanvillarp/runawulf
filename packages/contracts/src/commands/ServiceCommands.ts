/**
 * @file ServiceCommands.ts
 * @description Strongly-typed commands targeting systemd units through authorized adapters.
 */

import type { SystemCommand } from './SystemCommand.js';

export interface UnitActionPayload {
  readonly unitName: string;
}

export type RestartUnitCommand = SystemCommand<UnitActionPayload> & {
  readonly type: 'command.service.restart';
};

export type StopUnitCommand = SystemCommand<UnitActionPayload> & {
  readonly type: 'command.service.stop';
};

export type StartUnitCommand = SystemCommand<UnitActionPayload> & {
  readonly type: 'command.service.start';
};
